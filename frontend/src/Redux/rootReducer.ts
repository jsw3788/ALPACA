import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import themeReducer from './themeReducer';
import accountReducer from './accountReducer';
import commonReducer from './commonReducer';
import openviduReducer from './openviduReducer';
import roomReducer from './roomReducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['account', 'theme'],
};

const rootReducer = combineReducers({
  theme: themeReducer,
  account: accountReducer,
  common: commonReducer,
  openvidu: openviduReducer,
  room: roomReducer,
});

export default persistReducer(persistConfig, rootReducer);
