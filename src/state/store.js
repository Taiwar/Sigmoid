import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import * as reducers from './features';
import { fileService, discordService } from './middlewares';

const persistConfig = {
  key: 'root',
  blacklist: ['discord'],
  storage,
  stateReconciler: autoMergeLevel2
};


const logger = createLogger({
  predicate: (getState, action) => !action.type.includes('discord/SET_PRESENCE'),
});

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
