import { Howler } from 'howler';
import * as types from '../features/audio/types';
// eslint-disable-next-line no-undef
const { resolve } = window.require('path');
// eslint-disable-next-line no-undef
const { readdir, stat } = window.require('fs').promises;
// eslint-disable-next-line no-undef
const mimeTypes = window.require('mime-types');

const fileService = () => next => (action) => {
  if (action.type !== types.SCAN_FOLDER) {
    return next(action);
  }

  if (!action.path) {
    throw new Error(`'path' not specified for action ${action.type}`);
  }

  return getFiles(action.path)
    .then(files => handleFiles(files, action, next))
    .catch(e => console.error(e)); // TODO: Proper error handling
};

export default fileService;

function handleFiles(files, action, next) {
  const songs = [];
  files.forEach(async (file) => {
    const codec = file.type.split('/')[1];
    if (Howler.codecs(codec)) {
      songs.push(file);
    }
  });
  next({
    type: types.SET_LIBRARY,
    songs
  });

  return files;
}

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    const dirStat = await stat(res);
    return await dirStat.isDirectory() ? getFiles(res) : {
      name: subdir.split('.').slice(0, -1).join('.'),
      path: res,
      type: mimeTypes.contentType(res),
      size: dirStat.size,
      lastModified: new Date(dirStat.mtime)
    };
  }));
  return Array.prototype.concat(...files);
}
