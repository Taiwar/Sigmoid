/* eslint-disable import/prefer-default-export */
import * as types from './types';

export const addSong = song => ({
  type: types.ADD_SONG,
  song
});

export const removeSong = song => ({
  type: types.REMOVE_SONG,
  song
});
