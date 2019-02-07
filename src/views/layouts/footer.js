import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import FolderIcon from '@material-ui/icons/Folder';
import Fab from '@material-ui/core/Fab/Fab';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Input from '@material-ui/core/Input/Input';
import Grid from '@material-ui/core/Grid/Grid';
import { compose } from 'recompose';
import connect from 'react-redux/es/connect/connect';
import * as audioOperations from '../../state/features/audio/operations';

// eslint-disable-next-line no-undef
const dialog = window.require('electron').remote.dialog;

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
  const [path, setPath] = useState('');
  const { classes } = props;

  function handleOnScan() {
    props.onScan(path);
  }

  function handlePathChange(e) {
    setPath(e.target.value);
  }

  function handleOnDialogOpen() {
    dialog.showOpenDialog(null, { properties: ['openDirectory'] }, (dirname) => {
      setPath(dirname.toString());
    });
  }

  return (
    <footer className={classes.footer}>
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <FormControl margin="normal" required fullWidth>
            <Input
              id="path"
              className={classes.input}
              name="path"
              autoFocus
              value={path}
              onChange={handlePathChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <Fab size="small" color="primary" aria-label="Choose folder" className={classes.margin} onClick={handleOnDialogOpen}>
            <FolderIcon />
          </Fab>
          <Fab size="small" variant="extended" color="primary" aria-label="Scan" className={classes.margin} onClick={handleOnScan}>
            <RefreshIcon className={classes.extendedIcon} />
            Scan
          </Fab>
        </Grid>
      </Grid>
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
