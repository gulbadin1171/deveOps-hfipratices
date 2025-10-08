import * as React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { App } from './app';
import { AuthProvider } from './context/auth-context';
import { enableMocking } from './testing/mocks';

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

enableMocking().then(() => {
  createRoot(root).render(
    <React.StrictMode>
      {/* <AuthProvider> */}
      <App />
      {/* </AuthProvider> */}
    </React.StrictMode>,
  );
});
