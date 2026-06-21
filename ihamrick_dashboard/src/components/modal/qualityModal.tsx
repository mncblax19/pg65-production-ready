import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Pencil } from 'lucide-react';
import {
  useCreateLifeSuggestionMutation,
  useGetLifeSuggestionsQuery,
  useDeleteLifeSuggestionMutation,
} from '../../../services/allApi';

interface Item {
  id: string;
  text: string;
}

interface LifeSuggestion {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateLifeSuggestionRequest {
  type: 'decrease' | 'increase';
  content: string;
}

const QualityOfLifeModal: React.FC = () => {
  const [decreaseItems, setDecreaseItems] = useState<Item[]>([]);
  const [increaseItems, setIncreaseItems] = useState<Item[]>([]);
  const [showDecreaseInput, setShowDecreaseInput] = useState(false);
  const [showIncreaseInput, setShowIncreaseInput] = useState(false);
  const [decreaseInput, setDecreaseInput] = useState('');
  const [increaseInput, setIncreaseInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error } = useGetLifeSuggestionsQuery();
  const [createLifeSuggestion, { isLoading: isCreating }] = useCreateLifeSuggestionMutation();
  const [deleteLifeSuggestion] = useDeleteLifeSuggestionMutation();

  useEffect(() => {
    if (data) {
      const decreaseItemsMapped = data.data.decrease.map((item: LifeSuggestion) => ({
        id: item._id,
        text: item.content,
      }));
      const increaseItemsMapped = data.data.increase.map((item: LifeSuggestion) => ({
        id: item._id,
        text: item.content,
      }));

      setDecreaseItems(decreaseItemsMapped);
      setIncreaseItems(increaseItemsMapped);
    }
  }, [data]);

  // Add Decrease Item with Optimistic Update
  const addDecreaseItem = async () => {
    if (decreaseInput.trim()) {
      const newItem: CreateLifeSuggestionRequest = {
        type: 'decrease',
        content: decreaseInput.trim(),
      };

      // Optimistically update the UI
      const newItemData = { id: Date.now().toString(), text: decreaseInput.trim() }; // Temporary ID for optimistic update
      setDecreaseItems((prevItems) => [...prevItems, newItemData]);

      try {
        const result = await createLifeSuggestion(newItem);
        if (result?.data) {
          // Replace the optimistic ID with the real one after API call success
          setDecreaseItems((prevItems) =>
            prevItems.map((item) =>
              item.id === newItemData.id ? { ...item, id: result.data._id } : item,
            ),
          );
        }
      } catch (error) {
        console.error('Error adding life suggestion:', error);
        // Optionally, revert the optimistic update if the API fails
        setDecreaseItems((prevItems) => prevItems.filter((item) => item.id !== newItemData.id));
      }

      setDecreaseInput(''); // Clear input after submission
      setShowDecreaseInput(false); // Hide input field
    }
  };

  // Add Increase Item with Optimistic Update
  const addIncreaseItem = async () => {
    if (increaseInput.trim()) {
      const newItem: CreateLifeSuggestionRequest = {
        type: 'increase',
        content: increaseInput.trim(),
      };

      // Optimistically update the UI
      const newItemData = { id: Date.now().toString(), text: increaseInput.trim() }; // Temporary ID for optimistic update
      setIncreaseItems((prevItems) => [...prevItems, newItemData]);

      try {
        const result = await createLifeSuggestion(newItem);
        if (result?.data) {
          // Replace the optimistic ID with the real one after API call success
          setIncreaseItems((prevItems) =>
            prevItems.map((item) =>
              item.id === newItemData.id ? { ...item, id: result.data._id } : item,
            ),
          );
        }
      } catch (error) {
        console.error('Error adding life suggestion:', error);
        // Optionally, revert the optimistic update if the API fails
        setIncreaseItems((prevItems) => prevItems.filter((item) => item.id !== newItemData.id));
      }

      setIncreaseInput(''); // Clear input after submission
      setShowIncreaseInput(false); // Hide input field
    }
  };

  // Delete Decrease Item
  const deleteDecreaseItem = async (id: string) => {
    try {
      await deleteLifeSuggestion(id).unwrap();

      // Dynamically update state after deletion
      setDecreaseItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch {}
  };

  // Delete Increase Item
  const deleteIncreaseItem = async (id: string) => {
    try {
      await deleteLifeSuggestion(id).unwrap();

      // Dynamically update state after deletion
      setIncreaseItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch {}
  };

  // Handle key press for Decrease Item input
  const handleDecreaseKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addDecreaseItem();
    }
  };

  // Handle key press for Increase Item input
  const handleIncreaseKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIncreaseItem();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-poppins flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        <Pencil className="h-4 w-4" />
        Quality Of Life
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-gray-200 shadow-xl">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-poppins text-xl font-bold text-[#202020] md:text-2xl">
                  To Increase Quality of Life
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 transition-colors hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Decrease Column */}
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="font-poppins border-b-2 border-gray-400 bg-gray-300 px-4 py-3 text-center font-semibold text-[#202020]">
                    Decrease
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : error ? (
                      <div>Error fetching suggestions</div>
                    ) : (
                      decreaseItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center border-b border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50"
                        >
                          <button
                            onClick={() => deleteDecreaseItem(item.id)}
                            className="mr-3 flex size-7 min-w-7 shrink-0 items-center justify-center rounded-full text-red-400 transition hover:bg-black/5"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="text-[#202020]">{item.text}</span>
                        </div>
                      ))
                    )}
                    {showDecreaseInput && (
                      <div className="border-b border-gray-200 px-4 py-3">
                        <input
                          type="text"
                          value={decreaseInput}
                          onChange={(e) => setDecreaseInput(e.target.value)}
                          onKeyPress={handleDecreaseKeyPress}
                          onBlur={addDecreaseItem}
                          placeholder="Type and press Enter"
                          className="w-full rounded border border-gray-300 px-2 py-1 text-neutral-800 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowDecreaseInput(true)}
                    className="flex w-full items-center justify-center gap-2 bg-[#202020] py-2 text-white transition-colors hover:bg-gray-700"
                    disabled={isCreating} // Disable button during API call
                  >
                    <Plus size={18} />
                    {isCreating ? 'Adding...' : 'Add info'}
                  </button>
                </div>

                {/* Increase Column */}
                <div className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="font-poppins border-b-2 border-gray-400 bg-gray-300 px-4 py-3 text-center font-semibold text-[#202020]">
                    Increase
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : error ? (
                      <div>Error fetching suggestions</div>
                    ) : (
                      increaseItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center border-b border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50"
                        >
                          <button
                            onClick={() => deleteIncreaseItem(item.id)}
                            className="mr-3 flex size-7 min-w-7 shrink-0 items-center justify-center rounded-full text-red-400 transition hover:bg-black/5"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="text-[#202020]">{item.text}</span>
                        </div>
                      ))
                    )}
                    {showIncreaseInput && (
                      <div className="border-b border-gray-200 px-4 py-3">
                        <input
                          type="text"
                          value={increaseInput}
                          onChange={(e) => setIncreaseInput(e.target.value)}
                          onKeyPress={handleIncreaseKeyPress}
                          onBlur={addIncreaseItem}
                          placeholder="Type and press Enter"
                          className="w-full rounded border border-gray-300 px-2 py-1 text-neutral-800 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowIncreaseInput(true)}
                    className="flex w-full items-center justify-center gap-2 bg-[#202020] py-2 text-white transition-colors hover:bg-gray-700"
                    disabled={isCreating} // Disable button during API call
                  >
                    <Plus size={18} />
                    {isCreating ? 'Adding...' : 'Add info'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QualityOfLifeModal;
