
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeAdMob } from './services/admob/utils';

// Initialize AdMob as early as possible
if (window.Capacitor?.isPluginAvailable('AdMob') && window.Capacitor?.isNativePlatform()) {
  initializeAdMob().catch(error => {
    console.error("Failed to initialize AdMob:", error);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
