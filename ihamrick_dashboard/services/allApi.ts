import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

// const baseUrl = 'http://10.10.20.73:5005/api/';
const baseUrl = 'https://api.pg-65.com/api/';

// --- Interfaces ---
interface LoginRequest {
  email: string;
  password: string;
}
interface UserData {
  _id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
interface LoginResponse {
  success: boolean;
  message: string;
  data: { token: string; userData: UserData };
}
interface ForgotPasswordRequest {
  email: string;
}
interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}
interface VerifyOtpRequest {
  email: string;
  otp: string;
}
interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: { token: string };
}
interface ResendOtpRequest {
  email: string;
}
interface ResendOtpResponse {
  success: boolean;
  message: string;
}
interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
  otp: string;
}
interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
interface Video {
  _id: string;
  title: string;
  description: string;
  transcription: string;
  videoUrl: string;
  signedUrl: string;
  thumbnailUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  duration: number;
  uploadDate: string;
  status: boolean;
  views: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isNotified: boolean;
  formattedFileSize: string;
}
interface Podcast {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  transcription: string;
  date: string;
  status: string;
  admin: { _id: string; email: string };
  currentListeners: number;
  peakListeners: number;
  totalListeners: number;
  audioFormat: string;
  isRecording: boolean;
  podcastListeners: Array<{ joinedAt: string; sessionId: string; leftAt: string }>;
  createdAt: string;
  updatedAt: string;
  actualStart: string;
  liveSessionId: string;
  actualEnd: string;
  duration: number;
  activeListeners: number;
  streamConfig: {
    channelId: string;
    sessionId: string | null;
    socketNamespace: string;
    socketEndpoint: string;
    playbackMethod: string;
    playbackUrl: string | null;
    recordingBucket: string;
    roomId: string;
  };
}
interface Publication {
  _id: string;
  title: string;
  author: string;
  publicationDate: string;
  fileType: string;
  status: boolean;
  description: string;
  coverImage: string;
  file: string;
  createdAt: string;
  updatedAt: string;
}
interface Blog {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}
interface PublicationResponse {
  success: boolean;
  message: string;
  meta: { page: number; limit: number; total: number; totalPages: number | null };
  data: Publication[];
}
interface BlogResponse {
  success: boolean;
  message: string;
  meta: { page: number; limit: number; total: number; totalPages: number | null };
  data: Blog[];
}
interface LifeSuggestion {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
interface LifeSuggestionsResponse {
  success: boolean;
  message: string;
  data: { increase: LifeSuggestion[]; decrease: LifeSuggestion[] };
}
interface CreateLifeSuggestionRequest {
  type: 'increase' | 'decrease';
  content: string;
}
interface DeleteLifeSuggestionResponse {
  success: boolean;
  message: string;
}
interface BlogUpdateResponse {
  success: boolean;
  message: string;
  data: Blog;
}
interface SendNotifications {
  success: boolean;
  message: string;
  data?: {
    subscribersNotified: number;
    contentCounts: {
      blogs: number;
      publications: number;
      videos: number;
      podcasts: number;
      lifeSuggestions: number;
    };
    livePodcasts: number;
    emailsSent: number;
    emailsFailed: number;
  };
  errorSources?: { type: string; details: string }[];
  err?: { statusCode: number; stack?: string };
}
interface SocialLink {
  _id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
interface SocialLinkResponse {
  success: boolean;
  message: string;
  data: SocialLink[];
}
interface UpdateSocialLinkRequest {
  name: string;
  url: string;
}
interface UpdateSocialLinkResponse {
  success: boolean;
  message: string;
  data: SocialLink;
}
interface User {
  _id: string;
  email: string;
  role: string;
  location: string;
  phoneNumber: string;
  userName: string;
  profilePicture: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
interface MeResponse {
  success: boolean;
  message: string;
  data: User;
}
interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// --- API Definition ---
const allApi = createApi({
  reducerPath: 'allApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = Cookies.get('Ihamrickadmindashboardtoken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: [
    'User',
    'Blog',
    'PinnedBlog',
    'Video',
    'PinnedVideo',
    'Podcast',
    'PinnedPodcast',
    'Publication',
    'PinnedPublication',
    'LifeSuggestion',
    'SocialLink',
    'AboutUs',
    'PrivacyPolicy',
    'Motivations',
    'ContactText',
    'FooterText1',
    'FooterText2',
    'Banner',
    'Disclaimer',
    'Motivation',
    'Images',
    'RSS',
  ],

  endpoints: (builder) => ({
    // AUTH & PROFILE
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    getCurrentUser: builder.query<MeResponse, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/auth/update-profile',
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Blog', 'Video', 'Podcast', 'Publication', 'RSS'],
    }),

    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (email) => ({ url: '/auth/forgot-password', method: 'POST', body: email }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({ url: '/auth/verify-otp', method: 'POST', body }),
    }),
    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: (body) => ({ url: '/auth/resend-otp', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),

    getRSSSubscriptions: builder.query({
      query: (params) => ({
        url: '/rss-feed/',
        method: 'GET',
        params,
      }),
      providesTags: ['RSS'],
    }),

    // BLOGS
    getBlogs: builder.query<
      BlogResponse,
      { page?: number; limit?: number; sortBy?: string; sortOrder?: string }
    >({
      query: ({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }) => ({
        url: `/blog?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        method: 'GET',
      }),
      providesTags: ['Blog'],
    }),

    getPinnedBlogs: builder.query<any, void>({
      query: () => ({
        url: '/blog/admin-pinned',
        method: 'GET',
      }),
      providesTags: ['PinnedBlog'],
    }),

    togglePinBlog: builder.mutation<any, string>({
      query: (id) => ({
        url: `/blog/pin/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Blog', 'PinnedBlog'],
    }),

    createBlog: builder.mutation<void, { data: FormData }>({
      query: ({ data }) => ({
        url: '/blog/create-blog',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<BlogUpdateResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/blog/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation<BlogResponse, string>({
      query: (blogId) => ({
        url: `/blog/delete/${blogId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),

    // VIDEOS
    getVideos: builder.query<
      any,
      { page?: number; limit?: number; sortBy?: string; sortOrder?: string }
    >({
      query: ({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }) => ({
        url: `/videos/admin?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        method: 'GET',
      }),
      providesTags: ['Video'],
    }),
    getPinnedVideos: builder.query<any, void>({
      query: () => ({
        url: '/videos/admin-pinned',
        method: 'GET',
      }),
      providesTags: ['PinnedVideo'],
    }),

    togglePinVideos: builder.mutation<any, string>({
      query: (id) => ({
        url: `/videos/pin/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Video', 'PinnedVideo'],
    }),

    getVideoById: builder.query<Video, string>({
      query: (videoId) => ({
        url: `/videos/${videoId}`,
        method: 'GET',
      }),
      providesTags: ['Video'],
    }),
    uploadVideo: builder.mutation<{ success: boolean; message: string; data: Video }, FormData>({
      query: (formData) => ({
        url: '/videos/upload',
        method: 'POST',
        body: formData,
        timeout: 1800000,
      }),
      invalidatesTags: ['Video'],
    }),
    updateVideo: builder.mutation<
      { success: boolean; message: string; data: Video },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/videos/${id}`,
        method: 'PUT',
        body: data,
        timeout: 1800000,
      }),
      invalidatesTags: ['Video'],
    }),
    deleteVideo: builder.mutation<{ success: boolean; message: string; data: Video }, string>({
      query: (videoId) => ({
        url: `/videos/${videoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Video'],
    }),

    // PODCASTS
    getPodcasts: builder.query<
      any,
      { page?: number; limit?: number; sortBy?: string; sortOrder?: string }
    >({
      query: ({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }) => ({
        url: `/podcasts?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        method: 'GET',
      }),
      providesTags: ['Podcast'],
    }),

    getPinnedPodcasts: builder.query<any, void>({
      query: () => ({
        url: '/podcasts/admin-pinned',
        method: 'GET',
      }),
      providesTags: ['PinnedPodcast'],
    }),

    togglePinPodcasts: builder.mutation<any, string>({
      query: (id) => ({
        url: `/podcasts/pin/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Podcast', 'PinnedPodcast'],
    }),

    createPodcast: builder.mutation<void, FormData>({
      query: (data) => ({
        url: '/podcasts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Podcast'],
    }),
    updatePodcast: builder.mutation<
      { success: boolean; message: string; data: Podcast },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/podcasts/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Podcast'],
    }),
    startPodcast: builder.mutation<{ success: boolean; message: string; data: Podcast }, string>({
      query: (podcastId) => ({
        url: `/podcasts/start/${podcastId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Podcast'],
    }),
    endPodcast: builder.mutation<{ success: boolean; message: string; data: Podcast }, string>({
      query: (podcastId) => ({
        url: `/podcasts/end/${podcastId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Podcast'],
    }),
    deletePodcast: builder.mutation<{ success: boolean; message: string; data: Podcast }, string>({
      query: (podcastId) => ({
        url: `/podcasts/${podcastId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Podcast'],
    }),

    // PUBLICATIONS
    getPublications: builder.query<
      PublicationResponse,
      { page?: number; limit?: number; sortBy?: string; sortOrder?: string }
    >({
      query: ({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }) => ({
        url: `/publications?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        method: 'GET',
      }),
      providesTags: ['Publication'],
    }),

    getPinnedPublications: builder.query<any, void>({
      query: () => ({
        url: '/publications/admin-pinned',
        method: 'GET',
      }),
      providesTags: ['PinnedPublication'],
    }),

    togglePinPublications: builder.mutation<any, string>({
      query: (id) => ({
        url: `/publications/pin/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Publication', 'PinnedPublication'],
    }),

    createPublication: builder.mutation<void, FormData>({
      query: (data) => ({
        url: '/publications/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Publication'],
    }),
    updatePublication: builder.mutation<
      { success: boolean; message: string; data: Publication },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/publications/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Publication'],
    }),
    deletePublication: builder.mutation<
      { success: boolean; message: string; data: Publication },
      string
    >({
      query: (publicationId) => ({
        url: `/publications/delete/${publicationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Publication'],
    }),

    // LIFE SUGGESTIONS
    getLifeSuggestions: builder.query<LifeSuggestionsResponse, void>({
      query: () => ({
        url: '/life-suggestions/',
        method: 'GET',
      }),
      providesTags: ['LifeSuggestion'],
    }),
    createLifeSuggestion: builder.mutation<LifeSuggestion, CreateLifeSuggestionRequest>({
      query: (newLifeSuggestion) => ({
        url: '/life-suggestions/create',
        method: 'POST',
        body: newLifeSuggestion,
      }),
      invalidatesTags: ['LifeSuggestion'],
    }),
    deleteLifeSuggestion: builder.mutation<DeleteLifeSuggestionResponse, string>({
      query: (suggestionId) => ({
        url: `/life-suggestions/${suggestionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LifeSuggestion'],
    }),

    // SOCIAL LINKS
    getSocialLinks: builder.query<SocialLinkResponse, void>({
      query: () => ({
        url: '/social-links',
        method: 'GET',
      }),
      providesTags: ['SocialLink'],
    }),
    updateSocialLink: builder.mutation<
      UpdateSocialLinkResponse,
      { id: string; data: UpdateSocialLinkRequest }
    >({
      query: ({ id, data }) => ({
        url: `/social-links/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SocialLink'],
    }),

    // WEBSITE CONTENT
    getAboutUs: builder.query<any, void>({
      query: () => ({
        url: 'website-content/about-us',
        method: 'GET',
      }),
      providesTags: ['AboutUs'],
    }),
    updateAboutUs: builder.mutation<void, { content: string }>({
      query: (content) => ({
        url: 'website-content/about-us',
        method: 'PATCH',
        body: content,
      }),
      invalidatesTags: ['AboutUs'],
    }),
    getPrivacyPolicy: builder.query<any, void>({
      query: () => ({
        url: 'website-content/privacy-policy',
        method: 'GET',
      }),
      providesTags: ['PrivacyPolicy'],
    }),
    updatePrivacyPolicy: builder.mutation<void, { content: string }>({
      query: (content) => ({
        url: 'website-content/privacy-policy',
        method: 'PATCH',
        body: content,
      }),
      invalidatesTags: ['PrivacyPolicy'],
    }),

    // MOTIVATION
    getMotivation: builder.query<any, void>({
      query: () => ({
        url: 'website-content/motivation',
        method: 'GET',
      }),
      providesTags: ['Motivation'],
    }),
    updateMotivation: builder.mutation<void, { content: string }>({
      query: (body) => ({
        url: 'website-content/motivation',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Motivation'],
    }),

    // Contact
    getContactText: builder.query<any, void>({
      query: () => ({
        url: 'website-content/contact-text',
        method: 'GET',
      }),
      providesTags: ['ContactText'],
    }),
    updateContactText: builder.mutation<void, { content: string }>({
      query: (body) => ({
        url: 'website-content/contact-text',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['ContactText'],
    }),

    // FOOTER-1
    getFooterText1: builder.query<any, void>({
      query: () => ({
        url: 'website-content/footer-text-1',
        method: 'GET',
      }),
      providesTags: ['FooterText1'],
    }),
    updateFooterText1: builder.mutation<void, { content: string }>({
      query: (body) => ({
        url: 'website-content/footer-text-1',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['FooterText1'],
    }),

    // FOOTER-2
    getFooterText2: builder.query<any, void>({
      query: () => ({
        url: 'website-content/footer-text-2',
        method: 'GET',
      }),
      providesTags: ['FooterText2'],
    }),
    updateFooterText2: builder.mutation<void, { content: string }>({
      query: (body) => ({
        url: 'website-content/footer-text-2',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['FooterText2'],
    }),

    // DISCLAIMER
    getDisclaimer: builder.query<any, void>({
      query: () => ({
        url: 'website-content/disclaimer',
        method: 'GET',
      }),
      providesTags: ['Disclaimer'],
    }),
    updateDisclaimer: builder.mutation<void, { content: string }>({
      query: (body) => ({
        url: 'website-content/disclaimer',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Disclaimer'],
    }),

    // WEBSITE IMAGE
    getWebsiteImages: builder.query<any, void>({
      query: () => ({
        url: '/website-images',
        method: 'GET',
      }),
      providesTags: ['Banner'],
    }),
    updateWebsiteImages: builder.mutation<void, { id: string; updatedImage: FormData }>({
      query: ({ id, updatedImage }) => ({
        url: `/website-images/update/${id}`,
        method: 'PUT',
        body: updatedImage,
      }),
      invalidatesTags: ['Banner'],
    }),

    // NOTIFICATIONS
    sentNotifications: builder.mutation<SendNotifications, void>({
      query: () => ({
        url: '/notifications/send-notifications',
        method: 'POST',
      }),
    }),
  }),
});

// --- Exporting Hooks ---
export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useGetVideosQuery,
  useGetPodcastsQuery,
  useGetPublicationsQuery,
  useGetBlogsQuery,
  useGetPinnedBlogsQuery,
  useTogglePinBlogMutation,
  useCreateLifeSuggestionMutation,
  useGetLifeSuggestionsQuery,
  useDeleteLifeSuggestionMutation,
  useDeleteBlogMutation,
  useLogoutMutation,
  useUpdateBlogMutation,
  useSentNotificationsMutation,
  useGetSocialLinksQuery,
  useUpdateSocialLinkMutation,
  useUpdateAboutUsMutation,
  useUpdatePrivacyPolicyMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useCreateBlogMutation,
  useUploadVideoMutation,
  useDeleteVideoMutation,
  useGetVideoByIdQuery,
  useUpdateVideoMutation,
  useCreatePodcastMutation,
  useDeletePodcastMutation,
  useUpdatePodcastMutation,
  useCreatePublicationMutation,
  useUpdatePublicationMutation,
  useDeletePublicationMutation,
  useStartPodcastMutation,
  useEndPodcastMutation,
  useGetAboutUsQuery,
  useGetPrivacyPolicyQuery,
  useUpdateMotivationMutation,
  useGetPinnedPodcastsQuery,
  useGetPinnedPublicationsQuery,
  useGetPinnedVideosQuery,
  useTogglePinPodcastsMutation,
  useTogglePinPublicationsMutation,
  useTogglePinVideosMutation,
  useGetDisclaimerQuery,
  useGetFooterText1Query,
  useGetFooterText2Query,
  useGetMotivationQuery,
  useGetWebsiteImagesQuery,
  useUpdateDisclaimerMutation,
  useUpdateFooterText1Mutation,
  useUpdateFooterText2Mutation,
  useUpdateWebsiteImagesMutation,
  useGetContactTextQuery,
  useUpdateContactTextMutation,
  useGetRSSSubscriptionsQuery,
} = allApi;

export default allApi;
