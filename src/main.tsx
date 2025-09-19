import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Debug React instances
console.log('React version in main:', require('react').version);
console.log('React instance:', require('react'));

createRoot(document.getElementById("root")!).render(<App />);
