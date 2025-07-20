// apps/api/src/routes/admin.ts
import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

export default router;
