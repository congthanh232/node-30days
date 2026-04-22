import { Router } from 'express';
import authRoute from './auth.route.js';
import userRoute from './user.route.js';
import uploadRoute from './upload.route.js';
const v1Router = Router();

v1Router.use('/auth', authRoute);
v1Router.use('/users', userRoute);

v1Router.use('/upload', uploadRoute);

export default v1Router;