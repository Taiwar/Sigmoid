import * as types from '../features/audio/types';
// eslint-disable-next-line no-undef
const fs = window.require('fs');
// eslint-disable-next-line no-undef
const nodePath = window.require('path');
// eslint-disable-next-line no-undef
const mimeTypes = window.require('mime-types');

const fileService = () => next => (action) => {
  const result = next(action);
  if (action.type !== types.SCAN_FOLDER) {
    return result;
  }

  if (!action.path) {
    throw new Error(`'path' not specified for action ${action.type}`);
  }

  return fs.readdir(action.path, (err, files) => {
    if (err) {
      handleErrors(err, action, next);
    }
    handleFiles(action.path, files, action, next);
  });
};

export default fileService;

// eslint-disable-next-line no-unused-vars
function handleErrors(err, action, next) {
  // TODO: Implement error handling
  return Promise.reject(err);
}

function handleFiles(path, files, action, next) {
  const songs = [];
  files.forEach((file) => {
    const fullPath = nodePath.join(path, file);
    const stat = fs.statSync(fullPath);
    songs.push({
      name: file,
      path: fullPath,
      type: mimeTypes.contentType(fullPath),
      size: stat.size,
      lastModified: new Date(stat.mtime)
    });
  });
  next({
    type: 'SET_LIBRARY',
    songs
  });

  return files;
}
