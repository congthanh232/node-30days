import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { helmetOptions , corsOptions } from './config/security.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { requestLogger } from './middlewares/requestLogger.js';
import v1Router from './routes/v1/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use('/api', generalLimiter);
app.use(requestLogger);

app.use(express.json());
// CHỈ ĐỂ TEST - xóa sau khi test xong
// app.get('/test-error', (req, res, next) => {
//   next(new Error('Lỗi giả để test stacktrace'));
// });
app.get('/test-error', (req, res, next) => {
  throw new Error('Lỗi giả để test Telegram!');
});


app.get('/health', (req,res) => {
    res.json({status: 'ok'});
});

app.use('/api/v1', v1Router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
export default app;
