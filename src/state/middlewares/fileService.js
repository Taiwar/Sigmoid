import { Howler } from 'howler';
import * as types from '../features/audio/types';
// eslint-disable-next-line no-undef
const { resolve } = require('path');
// eslint-disable-next-line no-undef
const { readdir, stat } = require('fs').promises;
// eslint-disable-next-line no-undef
const mimeTypes = require('mime-types');

const fileService = () => next => (action) => {
  if (action.type === types.GET_TREE) {
    if (!action.path) {
      throw new Error(`'path' not specified for action ${action.type}`);
    }

    return getTreeSlice(action.path, null)
      .then(tree => handleTree(tree, action, next))
      .catch(e => console.error(e)); // TODO: Proper error handling
  }
  return next(action);
};

export default fileService;

function handleTree(tree, action, next) {
  next({
    type: types.SET_DIRECTORY_TREE,
    tree
  });
}

async function getTreeSlice(path, parent) {
  const dirStat = await stat(path);
  const scannedDir = {
    name: path.match(/([^/]*)\/*$/)[1],
    path: path,
    parent: parent,
    size: dirStat.size,
    type: 'dir',
    lastModified: new Date(dirStat.mtime),
  };
  const subDirs = await readdir(path);
  const items = await Promise.all(subDirs.map(async (subDir) => {
    const res = resolve(path, subDir);
    const dirStat = await stat(res);
    const isDir = await dirStat.isDirectory();
    if (isDir) {
      return getTreeSlice(res, scannedDir);
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
  scannedDir.items = items.filter(item => {
    if (item.type !== undefined && item.type) {
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
  return scannedDir;
}
