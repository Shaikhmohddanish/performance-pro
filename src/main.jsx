import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import SimpleApp from './SimpleApp.jsx'
import './styles.css'

console.log('main.jsx loaded');

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
  throw new Error('Failed to find the root element')
}

console.log('Root element found, rendering app...');

// Temporarily use SimpleApp for debugging
const AppComponent = window.location.search.includes('simple') ? SimpleApp : App;

createRoot(rootElement).render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>
)
