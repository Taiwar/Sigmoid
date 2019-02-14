import { combineReducers } from 'redux';
import * as types from './types';
import { createReducer } from '../../utils';

/* State shape
{
    rpc: object,
    presence: object
}
*/

const rpcReducer = createReducer([], {
  [types.INIT_SUCCESS]: (rpc, action) => action.rpc,
});

const presenceReducer = createReducer([], {
  [types.SET_PRESENCE]: (presence, action) => action.presence,
});

export default combineReducers({
  rpc: rpcReducer,
  presence: presenceReducer
});
