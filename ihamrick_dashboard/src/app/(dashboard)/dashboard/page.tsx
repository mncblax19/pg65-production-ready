'use client';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { StatCards } from '@/components/stat-cards';
import { ManageBlog } from '@/components/manage-blog';
import { ManageVideos } from '@/components/manage-videos';
import { ManagePodcasts } from '@/components/manage-padcasts';
import { ManagePublications } from '@/components/manage-publications';
import { UserProfile } from '@/components/user-profile';
import QualityOfLifeModal from '@/components/modal/qualityModal';
import { toast } from 'react-toastify';
import {
  useGetVideosQuery,
  useGetPodcastsQuery,
  useGetPublicationsQuery,
  useGetBlogsQuery,
  useGetSocialLinksQuery,
  useSentNotificationsMutation,
  useUpdateSocialLinkMutation,
} from '../../../../services/allApi';
import {
  setVideos,
  setPodcasts,
  setPublications,
  setBlogs,
} from '../../../../services/slices/mediaSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  // Fetch data using RTK Query hooks
  const { data: videos } = useGetVideosQuery({});
  const { data: podcasts } = useGetPodcastsQuery({});
  const { data: publications } = useGetPublicationsQuery({});
  const { data: blogs } = useGetBlogsQuery({});
  const { data: socialLinks, isLoading: isSocialLinksLoading } = useGetSocialLinksQuery();

  // Use the sentNotifications mutation
  const [sendNotifications, { isLoading: isNotificationLoading }] = useSentNotificationsMutation();

  // Use the updateSocialLink mutation
  const [updateSocialLink] = useUpdateSocialLinkMutation();

  // Local state for editable links
  const [editableLinks, setEditableLinks] = useState<{ [key: string]: boolean }>({});

  // Dispatch data to Redux when available
  useEffect(() => {
    if (videos) dispatch(setVideos(videos));
    if (podcasts) dispatch(setPodcasts(podcasts));
    if (publications) dispatch(setPublications(publications));
    if (blogs) dispatch(setBlogs(blogs));
  }, [dispatch, videos, podcasts, publications, blogs]);

  // Handle Notify All button click
  const handleNotifyAll = () => {
    sendNotifications()
      .unwrap()
      .then((response) => {
        setResponseMessage(response?.message);
        setShowResponseModal(true);
      })
      .catch((error) => {
        setResponseMessage(error?.data?.message || 'An error occurred');
        setShowResponseModal(true);
      });
  };
  const handleSaveLink = async (id: string, updatedLink: string, platformName: string) => {
    try {
      await updateSocialLink({
        id,
        data: {
          url: updatedLink, // Updated URL
          name: platformName, // Send the platform name along with the URL
        },
      }).unwrap();

      // Show a success toast
      toast.success(`${platformName} Link updated successfully`);
      setEditableLinks((prev) => ({ ...prev, [id]: false })); // Set the link to non-editable after saving
    } catch {
      // Show an error toast
      toast.error('Failed to update the link');
    }
  };

  // Function to handle editing the social link
  const handleEditLink = (id: string) => {
    setEditableLinks((prev) => ({ ...prev, [id]: true })); // Enable editing for the link
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 flex justify-end">
            <UserProfile />
          </div>
          <StatCards />

          {/* Centering the QualityOfLifeModal */}
          <div className="mt-6 flex items-center justify-center">
            <QualityOfLifeModal />
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleNotifyAll}
              className="transform rounded-lg bg-green-400 px-6 py-3 text-black shadow-md transition duration-300 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none active:scale-95"
            >
              Notify Subscribers About New Updates
            </button>
          </div>

          {isNotificationLoading && (
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-800">
              <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-blue-500"></div>
            </div>
          )}

          {/* Show the response modal */}
          {showResponseModal && (
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-800">
              <div className="w-full max-w-md scale-105 transform rounded-lg bg-white p-8 shadow-lg transition-transform duration-300 ease-out">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-800">Notification Status</h2>
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mb-6 text-gray-600">{responseMessage}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-white transition duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ManageBlog />
            <ManageVideos />
            <ManagePodcasts />
            <ManagePublications />
          </div>
          {/* Social Links Table - Positioned at the bottom of the page */}
          <div className="mt-12">
            <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
              <table className="min-w-full table-auto border-separate border-spacing-0 bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold">
                      Social Platform
                    </th>
                    <th className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold">
                      Link
                    </th>
                    <th className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isSocialLinksLoading ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-sm text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    socialLinks?.data?.map((link) => (
                      <tr
                        key={link._id}
                        className="transition duration-200 ease-in-out hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-200 px-6 py-4 text-sm font-medium text-gray-700">
                          {link.name}
                        </td>
                        <td className="border-b border-gray-200 px-6 py-4 text-sm font-medium text-gray-800">
                          <input
                            type="text"
                            defaultValue={link.url}
                            className="w-full rounded-md border p-2 text-gray-700 transition duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            id={`link-${link._id}`}
                            disabled={!editableLinks[link._id]} // Only allow editing if isEditable is true
                          />
                        </td>
                        <td className="border-b border-gray-200 px-6 py-4 text-sm">
                          <button
                            onClick={() => {
                              const updatedLink = (
                                document.getElementById(`link-${link._id}`) as HTMLInputElement
                              ).value;
                              if (editableLinks[link._id]) {
                                // Save the link, passing the name of the platform along with the updated link
                                handleSaveLink(link._id, updatedLink, link.name);
                              } else {
                                handleEditLink(link._id); // Enable editing
                              }
                            }}
                            className={`rounded-md px-6 py-2 text-sm font-medium transition duration-200 ease-in-out focus:outline-none ${
                              editableLinks[link._id]
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-yellow-400 text-gray-700 hover:bg-yellow-500'
                            }`}
                          >
                            {editableLinks[link._id] ? 'Save' : 'Edit'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
