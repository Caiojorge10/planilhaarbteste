import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estender a interface Request para incluir usuarioId
declare global {
  namespace Express {
    interface Request {
      usuarioId?: number;
    }
  }
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo') as any;
    req.usuarioId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
    return;
  }
} 