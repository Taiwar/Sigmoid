import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import * as reducers from './features';

const persistConfig = {
  key: 'root',
  storage,
};

export default function configureStore(initialState) {
  const rootReducer = persistReducer(persistConfig, combineReducers(reducers));

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      logger
    )
  );
}
