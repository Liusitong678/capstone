import express from 'express';
import aiRoutes from '../routes/aiRoutes.js';

const app = express();
app.use(express.json());

app.use('/api/ai', aiRoutes);

const PORT = 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

