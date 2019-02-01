/* eslint-disable import/prefer-default-export */
import * as types from './types';

export const addSong = song => ({
  type: types.ADD_SONG,
  song: {
    name: song.name,
    path: song.path,
    type: song.type,
    size: song.size,
    lastModified: song.lastModified
  }
});

export const removeSong = song => ({
  type: types.REMOVE_SONG,
  song
});
