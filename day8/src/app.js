import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { helmetOptions , corsOptions } from './config/security.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { requestLogger } from './middlewares/requestLogger.js';
import v1Router from './routes/v1/index.js';
import errorHandler from './middlewares/errorHandler.js';
import { seedOwners } from './seeder.js';


const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use('/api', generalLimiter);
app.use(requestLogger);
app.use(express.json());

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.get('/health', (req,res) => {
    res.json({status: 'ok'});
});
app.use('/api/v1', v1Router);

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── SEED ─────────────────────────────────────────────────────────────────────
await seedOwners();

export default app;
