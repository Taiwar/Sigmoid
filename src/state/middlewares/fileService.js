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
      .then(dirInfo => handleInfo(dirInfo, action, next))
      .catch(e => console.error(e)); // TODO: Proper error handling
  }
  return next(action);
};

export default fileService;

function handleInfo(dirInfo, action, next) {
  next({
    type: types.SET_DIRECTORY_INFO,
    tree: dirInfo.scannedDir,
    itemIndex: dirInfo.itemIndex
  });
}

async function getTreeSlice(path) {
  let itemIndex = [];
  const dirStat = await stat(path);
  // Format dir info into object
  const scannedDir = {
    name: path.match(/([^/]*)\/*$/)[1],
    path: path,
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
      // Recursive dir search
      const itemDirObject = await getTreeSlice(res);
      // Concat sub-index and current index
      itemIndex = [...itemIndex, ...itemDirObject['itemIndex']];
      // Add object to tree
      return itemDirObject['scannedDir'];
    } else {
      const song = {
        name: subDir.split('.')
          .slice(0, -1)
          .join('.'),
        path: res,
        type: mimeTypes.contentType(res),
        size: dirStat.size,
        lastModified: new Date(dirStat.mtime)
      };
      // Push copy to index
      itemIndex.push(Object.assign({}, song));
      // Add file to tree
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
  // Filter all non-playable items
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
  // Push copy of dir into index
  itemIndex.push(Object.assign({}, scannedDir));
  return { scannedDir, itemIndex };
}
