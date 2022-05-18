import { createSlice } from '@reduxjs/toolkit';

export interface Study {
  id: number;
  title: string;
  pinnedTime: string;
  profileImgList: string;
}

interface UserInfo {
  userId: string;
  username: string;
  nickname: string;
  info: string;
  profileImg: string | null;
  bojId: string;
  preferredLanguage: string;
  studies: Study[];
  isLogin: boolean;
}

const initialState: UserInfo = {
  userId: '',
  username: '',
  nickname: '',
  info: '',
  profileImg: '',
  bojId: '',
  preferredLanguage: '',
  studies: [],
  isLogin: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUserInfo: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    logout: (state) => {
      localStorage.clear();
      return {
        ...initialState,
      };
    },
    deleteStudyUserInfo: (state, action) => {
      state.studies = state.studies.filter((study) => study.id !== parseInt(action.payload));
    },
    setStudies: (state, action) => {
      state.studies = action.payload;
    },
  },
});

export const { setUserInfo, logout, deleteStudyUserInfo, setStudies } = accountSlice.actions;

export default accountSlice.reducer;
