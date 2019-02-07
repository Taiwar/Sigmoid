import React from 'react';
import { Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import routes from '../../routes';
import Footer from './footer';

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
          {
            routes.map(route => (
              <Route key={route.path} {...route} />
            ))
          }
        </main>
        <Footer/>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(App);
