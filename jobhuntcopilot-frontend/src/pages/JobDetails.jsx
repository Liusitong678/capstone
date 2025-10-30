import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJobs } from '../services/api';
import '../styles/JobDetail.css';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const list = await fetchJobs({ signal: ac.signal });
        const selected = list.find(j => j._uid === id);
        setJob(selected || null);
      } catch (e) {
        if (e.name !== 'AbortError') setErr(e.message || 'Load fail');
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [id]);

  if (loading) return <div className="center-tip">Loading job...</div>;
  if (err) return <div className="center-tip error">{err}</div>;
  if (!job) return <div className="center-tip">Job not found</div>;

  return (
    <div className="job-detail">
      <h2>{job.title}</h2>
      <h3>{job.company}</h3>
      <p>{job.description}</p>
      <p>Location: {job.location}</p>
      <p>Experience: {job.exp}</p>
      <p>Education: {job.edu}</p>
      <a href={job.applyUrl || '#'} target="_blank" rel="noreferrer">
        Apply
      </a>
    </div>
  );
}
