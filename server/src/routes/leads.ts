import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';

const router = Router();

const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone is required').isLength({ max: 20 }),
  body('ageGroup').trim().notEmpty().withMessage('Age group is required'),
  body('gender').trim().notEmpty().withMessage('Gender is required'),
  body('city').trim().notEmpty().withMessage('City is required').isLength({ max: 100 }),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('categories').isArray({ min: 1 }).withMessage('Select at least one category'),
];

// POST /api/leads
// Stores (or updates) a lead's details — no login/session involved.
router.post('/', leadValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, phone, ageGroup, gender, city, country, categories } = req.body as {
    name: string;
    email: string;
    phone: string;
    ageGroup: string;
    gender: string;
    city: string;
    country: string;
    categories: string[];
  };

  try {
    const lead = await prisma.lead.upsert({
      where: { email },
      create: { name, email, phone, ageGroup, gender, city, country, categories },
      update: { name, phone, ageGroup, gender, city, country, categories },
    });

    res.status(200).json({
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        categories: lead.categories,
      },
    });
  } catch (err) {
    console.error('Lead save error:', err);
    res.status(500).json({ error: 'Could not save your details. Please try again.' });
  }
});

export default router;
