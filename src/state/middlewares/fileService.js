import { Howler } from 'howler';
import * as types from '../features/audio/types';
// eslint-disable-next-line no-undef
const { resolve } = require('path');
// eslint-disable-next-line no-undef
const { readdir, stat } = require('fs').promises;
// eslint-disable-next-line no-undef
const mimeTypes = require('mime-types');

const fileService = () => next => (action) => {
  if (action.type === types.SCAN_FOLDER) {
    if (!action.path) {
      throw new Error(`'path' not specified for action ${action.type}`);
    }

    return getFiles(action.path)
      .then(files => handleFiles(files, action, next))
      .catch(e => console.error(e)); // TODO: Proper error handling
  } else if (action.type === types.GET_TREE_SLICE) {
    if (!action.path) {
      throw new Error(`'path' not specified for action ${action.type}`);
    }

    return getTreeSlice(action.path)
      .then(treeSlice => handleTreeSlice(treeSlice, action, next))
      .catch(e => console.error(e)); // TODO: Proper error handling
  }
  return next(action);
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
}

function handleTreeSlice(treeSlice, action, next) {
  if (typeof treeSlice.items !== 'string') {
    treeSlice.items = treeSlice.items.filter(item => {
      if (item.type !== undefined) {
        if (item.type === 'dir') {
          return true;
        }
        const codec = item.type.split('/')[1];
        if (Howler.codecs(codec)) {
          return true ;
        }
      }
      return false;
    });
  }
  next({
    type: types.SET_DIRECTORY_TREE_SLICE,
    treeSlice
  });
}

async function getTreeSlice(dir) {
  const subDirs = await readdir(dir);
  const items = await Promise.all(subDirs.map(async (subDir) => {
    const res = resolve(dir, subDir);
    const dirStat = await stat(res);
    const isDir = await dirStat.isDirectory();
    if (isDir) {
      return {
        name: subDir,
        path: res,
        size: dirStat.size,
        type: 'dir',
        lastModified: new Date(dirStat.mtime)
      };
    } else {
      return {
        name: subDir.split('.')
          .slice(0, -1)
          .join('.'),
        path: res,
        type: mimeTypes.contentType(res),
        size: dirStat.size,
        lastModified: new Date(dirStat.mtime)
      };
    }
  }));
  return {
    items
  };
}

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    const dirStat = await stat(res);
    return await dirStat.isDirectory() ? getFiles(res) : {
      name: subdir.split('.')
        .slice(0, -1)
        .join('.'),
      path: res,
      type: mimeTypes.contentType(res),
      size: dirStat.size,
      lastModified: new Date(dirStat.mtime)
    };
  }));
  return Array.prototype.concat(...files);
}
