import { Loader } from 'lucide-react'; // Import the Loader icon

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;  // Add the loading state here
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">Are you sure you want to delete this blog?</h2>
        <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
        
        {/* Modal Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}  // Disable button if isLoading is true
            className={`px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
