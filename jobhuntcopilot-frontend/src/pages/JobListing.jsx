import { useEffect, useState } from 'react';
import { fetchJobs } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/JobListing.css';

export default function JobList() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                const list = await fetchJobs({ signal: ac.signal });
                setJobs(list);
            } catch (e) {
                if (e.name !== 'AbortError') setErr(e.message || 'Load fail');
            } finally {
                setLoading(false);
            }
        })();
        return () => ac.abort();
    }, []);

    if (loading) return <div className="center-tip">Loading jobs...</div>;
    if (err) return <div className="center-tip error">{err}</div>;
    if (!jobs.length) return <div className="center-tip">No positions available</div>;

    return (
        <div className="joblist-root">
            <div className="joblist-container">
                {jobs.map(j => (
                    <div
                        key={j._uid}
                        className="job-card"
                        onClick={() => navigate(`/job/${j._uid}`)}
                    >
                        <div className="job-title">{j.title}</div>
                        <div className="company-name">{j.company}</div>
                        <div className="job-meta">{j.location}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
