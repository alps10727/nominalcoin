
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// This helps prevent issues with dynamic imports
const preloadComponents = async () => {
  try {
    // Preload critical components
    await Promise.all([
      import('./components/MobileNavigation'),
      import('./components/Header')
    ]);
    console.log('Critical components preloaded successfully');
  } catch (error) {
    console.error('Failed to preload components:', error);
  }
};

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const rootElement = createRoot(root);

// Preload components before rendering the app
preloadComponents().finally(() => {
  rootElement.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
