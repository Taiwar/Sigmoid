import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import * as reducers from './features';
import { fileService, discordService } from './middlewares';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
};

export default function configureStore(initialState) {
  const rootReducer = persistReducer(persistConfig, combineReducers(reducers));

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      fileService,
      discordService,
      logger
    )
  );
}
