// apps/api/src/routes/auth.ts
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = process.env.JWT_SECRET!;

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 3600000,
      })
      .json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

export default router;
