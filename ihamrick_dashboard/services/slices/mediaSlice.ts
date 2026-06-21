import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  admin: {
    _id: string;
    email: string;
  };
  currentListeners: number;
  peakListeners: number;
  totalListeners: number;
  audioFormat: string;
  isRecording: boolean;
  podcastListeners: Array<{
    joinedAt: string;
    sessionId: string;
    leftAt: string;
  }>;
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
  status: boolean;
  audioSignedUrl?: string;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number | null;
}

interface MediaState {
  videos: {
    success: boolean;
    message: string;
    meta: Meta;
    data: Video[];
  };
  podcasts: {
    success: boolean;
    message: string;
    results: number;
    data: { podcasts: Podcast[] };
  };
  publications: {
    success: boolean;
    message: string;
    meta: Meta;
    data: Publication[];
  };
  blogs: {
    success: boolean;
    message: string;
    meta: Meta;
    data: Blog[];
  };
}

const initialState: MediaState = {
  videos: {
    success: false,
    message: '',
    meta: { page: 0, limit: 0, total: 0, totalPages: null },
    data: [],
  },
  podcasts: {
    success: false,
    message: '',
    results: 0,
    data: { podcasts: [] },
  },
  publications: {
    success: false,
    message: '',
    meta: { page: 0, limit: 0, total: 0, totalPages: null },
    data: [],
  },
  blogs: {
    success: false,
    message: '',
    meta: { page: 0, limit: 0, total: 0, totalPages: null },
    data: [],
  },
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setVideos: (state, action: PayloadAction<typeof initialState.videos>) => {
      state.videos = action.payload;
    },
    setPodcasts: (state, action: PayloadAction<typeof initialState.podcasts>) => {
      state.podcasts = action.payload;
    },
    setPublications: (state, action: PayloadAction<typeof initialState.publications>) => {
      state.publications = action.payload;
    },
    setBlogs: (state, action: PayloadAction<typeof initialState.blogs>) => {
      state.blogs = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { setVideos, setPodcasts, setPublications, setBlogs, resetState } = mediaSlice.actions;

export default mediaSlice.reducer;
