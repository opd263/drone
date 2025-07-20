// apps/api/src/middleware/verifyToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
}
