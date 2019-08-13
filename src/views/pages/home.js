import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Howl, Howler } from 'howler';
import Grid from '@material-ui/core/Grid/Grid';
import { audioOperations } from '../../state/features/audio';
import { discordOperations } from '../../state/features/discord';
import {
  NowPlaying, Playlist, VolumeSlider, FolderView
} from '../components';

const { ipcRenderer } = window.require('electron');
const { globalShortcut, process } = window.require('electron').remote;
const mimeTypes = window.require('mime-types');

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    flexDirection: 'row',
    overflow: 'hidden'
  },
  library: {
    maxHeight: 500,
    overflow: 'auto',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2)
  }
});

function Home(props) {
  const [howl, setHowl] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [playHistory, setPlayHistory] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    props.initRpc();

    // o-> Handle "open with" dialogs when window already open
    ipcRenderer.on('processArgs', (event, message) => {
      if (message.length > 3) {
        handleProcessArgFile(message[3]);
      }
    });

    // Register media keys

    if (!globalShortcut.isRegistered('mediaplaypause')) {
      globalShortcut.register('mediaplaypause', handleToggle);
    }

    if (!globalShortcut.isRegistered('medianexttrack')) {
      globalShortcut.register('medianexttrack', handleNext);
    }

    if (!globalShortcut.isRegistered('mediaprevioustrack')) {
      globalShortcut.register('mediaprevioustrack', handlePrev);
    }

    // Cleanup

    return () => {
      howl.stop();
      props.rpc.destroy();
      globalShortcut.unregister('mediaplaypause');
      globalShortcut.unregister('medianexttrack');
      globalShortcut.unregister('mediaprevioustrack');
    };
  }, []);

  useEffect(() => {
    const first = playlist[0];
    if (first && first !== currentSong) {
      if (howl) howl.stop();
      const sound = new Howl({
        src: [first.path]
      });
      sound.on('end', handleNext);
      Howler.volume(props.volume);

      props.setPresence(props.rpc, {
        details: first.name,
        state: 'Listening',
        largeImageKey: 'sigmoid_large',
        largeImageText: 'Sigmoid',
        startTimestamp: new Date()
      });

      sound.play();
      setHowl(sound);
      setCurrentSong(first);
    }
  }, [playlist]);

  function handlePlaylistPlay(song) {
    // Is song already playing?
    if (song !== currentSong) {
      let index = playlist.indexOf(song);
      let newHistory;
      let newPlaylist;
      if (index === -1) {
        // Song is in history
        index = playHistory.indexOf(song);
        if (index === 0) {
          // Song is first history item
          // Copy history
          newHistory = [...playHistory];
          // Remove first item from new history
          newHistory.splice(0, 1);
          // Add first item to playlist (copy because immutable state)
          newPlaylist = [playHistory[0], ...playlist];
        } else if (index === playHistory.length - 1) {
          // Song is last history item
          // New history is empty
          newHistory = [];
          // Add all history songs to playlist (copy), accounting for reverse order
          newPlaylist = [...playHistory.reverse(), ...playlist];
        } else {
          // Song is any other history item
          // New history is every item before song (copy)
          newHistory = [...playHistory].slice(index + 1);
          // Add song and all items after it to playlist (copy), accounting for reverse order
          newPlaylist = [...[...playHistory].slice(0, index + 1).reverse(), ...playlist]
        }
      } else {
        // Song is in playlist
        if (index === 0) {
          // Song already playing
          return;
        } else if (index === playlist.length - 1) {
          // Song is last of playlist
          // History is every other song in playlist plus previous history (copy), accounting for reverse order
          newHistory = [...playlist.slice(0, playlist.length - 1).reverse(), ...playHistory];
          // Playlist is last song
          newPlaylist = [playlist[playlist.length - 1]];
        } else {
          // Song is any other item in playlist
          // New history is every song before item (copy), accounting for reverse order
          newHistory = [...[...playlist].slice(0, index).reverse(), ...playHistory];
          // New playlist is song and everything after it (copy)
          newPlaylist = [...playlist].slice(index);
        }
      }
      // Update state
      setPlaylist(newPlaylist);
      setPlayHistory(newHistory);
    }
  }

  function handleLibraryPlay(song) {
    if (playlist.includes(song)) return;
    setPlaylist([...playlist, song]);
  }

  function handleToggle() {
    if (howl.playing()) {
      howl.pause();
    } else {
      howl.play();
    }
  }

  function handleNext() {
    if (playlist.length > 1) {
      return handlePlaylistPlay(playlist[1]);
    }
  }

  function handlePrev() {
    if (playHistory.length > 0) {
      handlePlaylistPlay(playHistory[0]);
    }
  }

  function handlePlaylistRepositioning(oldIndex, newIndex) {
    // If-clauses handle move between history and playlist
    if (oldIndex < 0) {
      const newHistory = [...playHistory];
      if (newIndex < 0) {
        // Move is from history to history
        // TODO: Why is this broken?
        const adjustedNew = (newIndex+1) === 0 ? (newIndex+1) : (newIndex+1)*(-1);
        const adjustedOld = (oldIndex+1) === 0 ? (oldIndex+1) : (oldIndex+1)*(-1);
        let tmp = newHistory[adjustedNew];
        newHistory[adjustedNew] = newHistory[adjustedOld];
        newHistory[adjustedOld] = tmp;
        setPlayHistory(newHistory);
      } else {
        // Move is from history to playlist
        const newPlaylist = [...playlist];
        const endIndex = (oldIndex+1) === 0 ? (oldIndex+1) : (oldIndex+1)*(-1);
        newPlaylist.splice(newIndex, 0, playHistory[endIndex]);
        newHistory.splice(endIndex, 1);
        setPlaylist(newPlaylist);
        setPlayHistory(newHistory);
      }
    } else {
      const newPlaylist = [...playlist];
      if (newIndex < 0) {
        // Move is from playlist to history
        const newHistory = [...playHistory];
        const startIndex = (newIndex+1) === 0 ? (newIndex+1) : (newIndex+1)*(-1);
        newHistory.splice(startIndex, 0, playHistory[oldIndex]);
        newPlaylist.splice(oldIndex, 1);
        setPlaylist(newPlaylist);
        setPlayHistory(newHistory);
      } else {
        // Move is from playlist to playlist
        newPlaylist.splice(newIndex, 0, newPlaylist.splice(oldIndex, 1)[0]);
        setPlaylist(newPlaylist);
      }
    }
  }

  function handleDelete(song) {
    let index = playlist.indexOf(song);
    if (index === -1) {
      // Song is in history
      index = playHistory.indexOf(song);
      const newHistory = [...playHistory];
      newHistory.splice(index, 1);
      setPlayHistory(newHistory);
    } else {
      const newPlaylist = [...playlist];
      newPlaylist.splice(index, 1);
      setPlaylist(newPlaylist);
    }
  }

  function handleClear() {
    setPlaylist([]);
    setPlayHistory([]);
  }

  function handleProcessArgFile(potentialMediaFilePath) {
    if (potentialMediaFilePath.length > 1 && playlist.filter(s => s.path === potentialMediaFilePath).length === 0) {
      // TODO: Split only works for Windows
      const song = {
        name: potentialMediaFilePath.split('\\')
          .slice(-1)[0]
          .split('.')
          .slice(0, -1),
        path: potentialMediaFilePath,
        type: mimeTypes.contentType(potentialMediaFilePath),
        size: -1,
        lastModified: new Date()
      };
      handleLibraryPlay(song);
    }
  }

  function recTree(item, list) {
    if (item.type !== 'dir') {
      list.push(item);
    } else {
      const added = item.items.map(i => recTree(i, list));
      list.concat(added);
    }
    return list;
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function handleShuffle(dir) {
    setPlayHistory([]);
    // TODO: This is horribly inefficient and shouldn't have to be done after the initial library dir crawl
    const list = recTree(dir, []);
    shuffle(list);
    setPlaylist(list);
  }

  const {
    volume, onStoreVolume, classes
  } = props;

  if (process.argv.length > 1) {
    handleProcessArgFile(process.argv[1]);
  }

  return (
    <div className={classes.main}>
      <NowPlaying
        song={currentSong}
        howl={howl}
        onNext={handleNext}
        onPrev={handlePrev}
        onToggle={handleToggle}
      />
      <Grid container spacing={8}>
        <Grid item xs={1}>
          <VolumeSlider volume={volume} storeVolume={onStoreVolume}/>
        </Grid>
        <Grid item xs={7}>
          <FolderView onPlay={handleLibraryPlay} onShuffle={handleShuffle}/>
        </Grid>
        <Grid item xs={4}>
          <Playlist
            playlist={playlist}
            playHistory={playHistory}
            onPlay={handlePlaylistPlay}
            onChange={handlePlaylistRepositioning}
            onClear={handleClear}
            onDelete={handleDelete}
          />
        </Grid>
      </Grid>
    </div>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  volume: PropTypes.number,
  rpc: PropTypes.object,
  initRpc: PropTypes.func,
  setPresence: PropTypes.func,
  onStoreVolume: PropTypes.func
};

Home.defaultProps = {
  library: []
};

const mapStateToProps = state => ({
  library: state.audio.library,
  volume: state.audio.volume,
  rpc: state.discord.rpc
});

const mapDispatchToProps = {
  onAdd: audioOperations.addSongToLibrary,
  onStoreVolume: audioOperations.setVolume,
  initRpc: discordOperations.init,
  setPresence: discordOperations.setPresence
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Home);
