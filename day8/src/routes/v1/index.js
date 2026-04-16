import { Router } from 'express';
import authRoute from './auth.route.js';
import userRoute from './user.route.js';

const v1Router = Router();

v1Router.use('/auth', authRoute);
v1Router.use('/users', userRoute);

export default v1Router;