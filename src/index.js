import React from 'react';

import 'typeface-roboto';
import { render } from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { App } from './views/layouts';
import configureStore from './state/store';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'
import 'react-contexify/dist/ReactContexify.min.css';

// eslint-disable-next-line no-undef
const reduxStore = configureStore({
  audio: {
    library: [],
    volume: 0.5
  },
  discord: {
    rpc: null,
    presence: null
  }
});

const persistor = persistStore(reduxStore);
// persistor.purge();

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
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
      <MuiThemeProvider theme={theme}>
        <DndProvider backend={HTML5Backend}>
          <App/>
        </DndProvider>
      </MuiThemeProvider>
    </PersistGate>
  </ReduxProvider>
);

// eslint-disable-next-line no-undef
render(<RootHtml/>, document.getElementById('react-root'));
