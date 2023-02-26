/**
 * @file Main entry point for the application.
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
// END IMPORTS ==========================================================================================   END IMPORTS

// MAIN =========================================================================================================  MAIN
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
)
// END MAIN ================================================================================================   END MAIN
