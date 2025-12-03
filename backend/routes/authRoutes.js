import express from 'express';
import {
  generateResetToken,
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword
} from '../controllers/auth.controller.js';

import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/is-auth', userAuth, isAuthenticated);
authRouter.post('/request-reset', generateResetToken);
authRouter.post('/reset-password', resetPassword);

export default authRouter;
