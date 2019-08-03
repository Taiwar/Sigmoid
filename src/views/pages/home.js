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

const { globalShortcut, process } = window.require('electron').remote;

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
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    props.initRpc();

    console.log("process args", process.argv);

    if (!globalShortcut.isRegistered('mediaplaypause')) {
      globalShortcut.register('mediaplaypause', handleToggle);
    }

    if (!globalShortcut.isRegistered('medianexttrack')) {
      globalShortcut.register('medianexttrack', handleNext);
    }

    if (!globalShortcut.isRegistered('mediaprevioustrack')) {
      globalShortcut.register('mediaprevioustrack', handlePrev);
    }

    return () => {
      howl.stop();
      props.rpc.destroy();
      globalShortcut.unregister('mediaplaypause');
      globalShortcut.unregister('medianexttrack');
      globalShortcut.unregister('mediaprevioustrack');
    };
  }, []);

  useEffect(() => {
    const first = playlist.find(song => song.index === 1);
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
    if (song !== currentSong) {
      const newPlaylist = [];
      let i = 2;
      playlist.forEach((s) => {
        if (s === song) {
          s.index = 1;
        } else if (s === currentSong) {
          s.index = -1;
        } else if (s.index < 0) {
          s.index -= 1;
        } else {
          s.index = i;
          i += 1;
        }
        newPlaylist.push(s);
      });
      setPlaylist(newPlaylist);
    }
  }

  function handleLibraryPlay(song) {
    if (playlist.includes(song)) return;
    const enqueued = playlist.filter(s => s.index > 0);
    song.index = enqueued.length + 1;
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
    return handlePlaylistPlay(playlist.find(song => song.index === 2));
  }

  function handlePrev() {
    handlePlaylistPlay(playlist.find(song => song.index === -1));
  }

  const {
    volume, onStoreVolume, classes
  } = props;

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
          <FolderView onPlay={handleLibraryPlay}/>
        </Grid>
        <Grid item xs={4}>
          <Playlist
            playlist={playlist}
            onPlay={handlePlaylistPlay}
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
  onAdd: PropTypes.func,
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
