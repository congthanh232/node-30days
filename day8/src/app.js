import express from 'express';
import v1Router from './routes/v1/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/health', (req,res) => {
    res.json({status: 'ok'});
});

app.use('/api/v1', v1Router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
