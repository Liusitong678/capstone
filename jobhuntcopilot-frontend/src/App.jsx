import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import JobListing from './pages/JobListing';
import JobDetails from './pages/JobDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />        {/* Default page */}
        <Route path="/jobs" element={<JobListing />} />   {/* Job listing page */}
        <Route path="/job/:id" element={<JobDetails />} /> {/* Job detail page */}
      </Routes>
    </Router>
  )
}

export default App;
