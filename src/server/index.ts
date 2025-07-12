import express from 'express';
import submitRoute from './routes/submit';
import statusRoute from './routes/status';

const app = express();
app.use(express.json());

app.use('/submit', submitRoute);
app.use('/status', statusRoute);

app.get('/health', (_, res) => res.send('OK'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
