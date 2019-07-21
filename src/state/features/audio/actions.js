import * as types from './types';

export const setDirectoryRoot = path => ({
  type: types.SET_DIRECTORY_ROOT,
  path
});

export const getTree = path => ({
  type: types.GET_TREE,
  path
});

export const setLibrary = songs => ({
  type: types.SET_LIBRARY,
  songs
});

export const addSongToLibrary = song => ({
  type: types.ADD_SONG_LIBRARY,
  song: {
    name: song.name,
    path: song.path,
    type: song.type,
    size: song.size,
    lastModified: song.lastModified
  }
});

export const removeSongFromLibrary = song => ({
  type: types.REMOVE_SONG_LIBRARY,
  song
});

export const setVolume = volume => ({
  type: types.SET_VOLUME,
  volume
});
