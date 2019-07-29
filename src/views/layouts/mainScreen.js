import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Home from '../pages/home';

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    backgroundColor: '#222222'
  },
  content: {
    flex: 1
  }
};


class App extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline/>
        <main className={classes.content}>
          <Home />
        </main>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(App);
