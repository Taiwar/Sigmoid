import * as types from './types';

export const init = () => ({
  type: types.INIT
});

export const setPresence = (rpc, presence) => ({
  type: types.SET_PRESENCE,
  rpc,
  presence
});
