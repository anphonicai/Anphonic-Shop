import { Request, Response, NextFunction } from 'express';
import { timingSafeEqual } from 'crypto';

// Guards admin-only routes — compares the caller's key against ADMIN_KEY with
// a timing-safe check so response time can't be used to brute-force the key
// byte by byte.
export function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_KEY;
  const provided = req.header('x-admin-key') ?? '';

  if (!expected) {
    res.status(500).json({ error: 'Admin routes are not configured' });
    return;
  }

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  const match = a.length === b.length && timingSafeEqual(a, b);

  if (!match) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
