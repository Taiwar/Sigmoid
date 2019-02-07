import * as types from './types';

export const scanFolder = path => ({
  type: types.SCAN_FOLDER,
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
