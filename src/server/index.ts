import express from 'express';
import submitRoute from './routes/submit';
import statusRoute from './routes/status';
import monitorRoute from './routes/monitor';

const app = express();
app.use(express.json());

app.use('/submit', submitRoute);
app.use('/status', statusRoute);
app.use('/monitor', monitorRoute);

app.get('/health', (_, res) => res.send('OK'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
