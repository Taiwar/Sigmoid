import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import RefreshIcon from '@material-ui/icons/Refresh';
import Fab from '@material-ui/core/Fab/Fab';
import { compose } from 'recompose';
import connect from 'react-redux/es/connect/connect';
import * as audioOperations from '../../state/features/audio/operations';

// eslint-disable-next-line no-undef
const dialog = require('electron').remote.dialog;

const styles = theme => ({
  footer: {
    backgroundColor: '#111111',
    padding: theme.spacing(),
    paddingLeft: theme.spacing(2)
  },
  margin: {
    margin: theme.spacing()
  },
  extendedIcon: {
    marginRight: theme.spacing(),
  },
  input: {
    color: '#eeeeee',
    '&:before': {
      borderBottom: '1px solid #cccccc'
    },
    '&:hover': {
      borderBottom: '1px solid #666666'
    }
  }
});


function Footer(props) {
  const { classes } = props;

  function handleOnRootDialogOpen() {
    dialog.showOpenDialog(null, { properties: ['openDirectory'] }, (dirname) => {
      if (dirname) {
        props.onSetRoot(dirname.toString());
      }
    });
  }

  function handleOnScanDialogOpen() {
    dialog.showOpenDialog(null, { properties: ['openDirectory'] }, (dirname) => {
      if (dirname) {
        props.onScan(dirname.toString());
      }
    });
  }

  return (
    <footer className={classes.footer}>
      <Fab size="small" variant="extended" color="primary" aria-label="Scan" className={classes.margin} onClick={handleOnRootDialogOpen} href={""}>
        <FolderIcon className={classes.extendedIcon} />
        Select Root
      </Fab>
      <Fab size="small" variant="extended" color="primary" aria-label="Scan" className={classes.margin} onClick={handleOnScanDialogOpen} href={""}>
        <RefreshIcon className={classes.extendedIcon} />
        Scan
      </Fab>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  onScan: PropTypes.func,
  onSetRoot: PropTypes.func
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onScan: audioOperations.scanFolder,
  onSetRoot: audioOperations.setDirectoryRoot
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Footer);
