import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import Fab from '@material-ui/core/Fab/Fab';
import { compose } from 'recompose';
import connect from 'react-redux/es/connect/connect';
import * as audioOperations from '../../state/features/audio/operations';

// eslint-disable-next-line no-undef
const dialog = require('electron').remote.dialog;

const styles = theme => ({
  footer: {
    backgroundColor: '#111111',
    padding: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2
  },
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
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

  function handleOnDialogOpen() {
    dialog.showOpenDialog(null, { properties: ['openDirectory'] }, (dirname) => {
      if (dirname) {
        props.onScan(dirname.toString());
      }
    });
  }

  return (
    <footer className={classes.footer}>
      <Fab size="small" variant="extended" color="primary" aria-label="Scan" className={classes.margin} onClick={handleOnDialogOpen}>
        <FolderIcon className={classes.extendedIcon} />
        Scan
      </Fab>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  onScan: PropTypes.func
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onScan: audioOperations.scanFolder
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Footer);
