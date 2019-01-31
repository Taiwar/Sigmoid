import React from 'react';

import 'typeface-roboto';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { App } from './views/layouts';
import history from './state/history';
import configureStore from './state/store';

// eslint-disable-next-line no-undef
const reduxStore = configureStore({
  audio: {
    playlist: []
  }
});

const persistor = persistStore(reduxStore);
persistor.purge();

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#3f51b5'
    },
    secondary: {
      main: '#00e5ff'
    }
  },
});

const RootHtml = () => (
  <ReduxProvider store={reduxStore}>
    <PersistGate loading={null} persistor={persistor}>
      <Router history={history}>
        <MuiThemeProvider theme={theme}>
          <App/>
        </MuiThemeProvider>
      </Router>
    </PersistGate>
  </ReduxProvider>
);

// eslint-disable-next-line no-undef
render(<RootHtml/>, document.getElementById('react-root'));
