import { combineReducers } from 'redux';
import * as types from './types';
import { createReducer } from '../../utils';

/* State shape
{
    library: [song]
}
*/

const libraryReducer = createReducer([], {
  [types.SET_LIBRARY]: (library, action) => action.songs,
  [types.ADD_SONG_LIBRARY]: (library, action) => [...library, action.song],
  [types.REMOVE_SONG_LIBRARY]: (library, action) => library
    .filter(song => song.path !== action.song.path)
});


export default combineReducers({
  library: libraryReducer
});
