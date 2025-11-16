import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css'
import {BrowserRouter} from "react-router-dom";
import { AuthProvider } from "./firebase/AuthProvider";




createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <AuthProvider>     {/* ⭐ Wrap entire app */}
              <App />
          </AuthProvider>
      </BrowserRouter>
  </StrictMode>,
)
