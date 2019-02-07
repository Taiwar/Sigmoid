import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import * as types from './types';
import { createReducer } from '../../utils';

/* State shape
{
    playlist: [song],
    library: [song]
}
*/

const playlistReducer = createReducer([], {
  [types.ADD_SONG_PLAYLIST]: (playlist, action) => [...playlist, action.song],
  [types.REMOVE_SONG_PLAYLIST]: (playlist, action) => playlist
    .filter(song => song.path !== action.song.path)
});

const libraryReducer = createReducer([], {
  [types.SET_LIBRARY]: (library, action) => action.songs,
  [types.ADD_SONG_LIBRARY]: (library, action) => [...library, action.song],
  [types.REMOVE_SONG_LIBRARY]: (library, action) => library
    .filter(song => song.path !== action.song.path)
});

const persistConfig = {
  key: 'audio',
  storage,
  blacklist: ['playlist']
};

export default persistReducer(persistConfig, combineReducers({
  playlist: playlistReducer,
  library: libraryReducer
}));
