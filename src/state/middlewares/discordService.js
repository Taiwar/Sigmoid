import * as types from '../features/discord/types';
// eslint-disable-next-line no-undef
const discordRPC = window.require('discord-rpc');

const discordService = () => next => (action) => {
  if (action.type === types.INIT) {
    // eslint-disable-next-line no-undef
    const clientId = process.env.REACT_APP_CLIENT_ID;
    if (clientId !== undefined && clientId !== '') {
      discordRPC.register(clientId);
      const rpc = new discordRPC.Client({ transport: 'ipc' });
      rpc.login({ clientId }).catch(console.error);
      rpc.on('ready', () => {
        next({
          type: types.INIT_SUCCESS,
          rpc
        });
      });
    }
  } else if (action.type === types.SET_PRESENCE) {
    if (action.rpc !== null) {
      setActivity(action.rpc, action.presence).then(() => {
        next({
          type: types.SET_PRESENCE_SUCCESS,
          presence: action.presence
        });
      });
    }
  }
  return next(action);
};

export default discordService;

async function setActivity(rpc, presence) {
  if (!rpc) {
    return;
  }

  return rpc.setActivity(presence);
}
