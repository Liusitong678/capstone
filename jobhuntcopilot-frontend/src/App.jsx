import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      {/* Navbar will be visible on all pages */}
      <Navbar />

      <Routes>
        {/* Landing page */}
        <Route
          path="/"
          element={
            <>
              <div>
                <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
                  <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                  <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
              </div>

              <h1>Job Hunt Copilot with Vite + React</h1>

              <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                  count is {count}
                </button>
                <p>
                  Edit <code>src/App.jsx</code> and save to test HMR
                </p>
              </div>

              <p className="read-the-docs">
                Click on the Vite and React logos to learn more
              </p>
            </>
          }
        />

        {/* Dashboard page */}
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
