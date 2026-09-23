import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('feedants_theme') || 'light',
  isAuthModalOpen: false,
  authModalMode: 'signin', // 'signin' | 'signup'
  feedFilter: 'latest', // 'latest' | 'trending' | 'following'
  exploreCategory: 'all',
  profileTab: 'posts', // 'posts' | 'snippets' | 'saved'
  isSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('feedants_theme', state.theme);
    },
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authModalMode = action.payload || 'signin';
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthModalMode: (state, action) => {
      state.authModalMode = action.payload;
    },
    setFeedFilter: (state, action) => {
      state.feedFilter = action.payload;
    },
    setExploreCategory: (state, action) => {
      state.exploreCategory = action.payload;
    },
    setProfileTab: (state, action) => {
      state.profileTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
  },
});

export const {
  toggleTheme,
  openAuthModal,
  closeAuthModal,
  setAuthModalMode,
  setFeedFilter,
  setExploreCategory,
  setProfileTab,
  toggleSidebar,
  closeSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;
