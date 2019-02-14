import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist'
import * as types from './types';
import { createReducer } from '../../utils';
import storage from 'redux-persist/lib/storage'

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

const discordPersistConfig = {
  key: 'discord',
  storage: storage,
  blacklist: ['rpc']
};


export default persistReducer(discordPersistConfig,combineReducers({
  rpc: rpcReducer,
  presence: presenceReducer
}));
