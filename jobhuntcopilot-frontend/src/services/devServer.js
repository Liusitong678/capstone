// dev environment
import express from 'express';
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log('[HIT]', req.method, req.url);
  next();
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/api/ai/score', (req, res) => {
  res.json({ score: 0.82, matched: ['react'], missing: ['aws'] });
});
app.post('/api/ai/cover-letter', (req, res) => {
  res.json({ text: 'Dear Hiring Manager, I am excited to apply for this position...' });
});

app.use((req, res) => res.status(404).json({ error: 'Not Found', path: req.path }));

const PORT = 5050;
app.listen(PORT, '127.0.0.1', () => console.log(`DEV server on http://127.0.0.1:${PORT}`));
