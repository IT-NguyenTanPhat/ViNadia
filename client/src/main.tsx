import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.tsx';
import { Provider } from 'react-redux';
import { store } from './state/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
