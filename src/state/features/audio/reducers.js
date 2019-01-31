import { combineReducers } from 'redux';
import * as types from './types';
import { createReducer } from '../../utils';

/* State shape
{
    playlist: [song]
}
*/

const playlistReducer = createReducer([], {
  [types.ADD_SONG]: (state, action) => {
    console.log(state, action);
    return [...state, action.song];
  },
  [types.REMOVE_SONG]: (state, action) => state
    .filter(song => song.path !== action.song.path)
});

export default combineReducers({
  playlist: playlistReducer,
});
