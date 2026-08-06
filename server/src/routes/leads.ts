import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';
import { requireAdminKey } from '../lib/adminAuth';

const router = Router();

const CSV_COLUMNS = ['name', 'email', 'phone', 'ageGroup', 'gender', 'city', 'country', 'categories', 'createdAt'] as const;

// Wraps a value in quotes and escapes any quotes inside it, per RFC 4180 —
// needed since names/cities can contain commas.
const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

const stripTags = (value: string) => value.replace(/<[^>]*>/g, '');

const leadValidation = [
  body('name').trim().customSanitizer(stripTags).notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone is required').isLength({ max: 20 }),
  body('ageGroup').trim().notEmpty().withMessage('Age group is required'),
  body('gender').trim().notEmpty().withMessage('Gender is required'),
  body('city').trim().customSanitizer(stripTags).notEmpty().withMessage('City is required').isLength({ max: 100 }),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('categories').isArray({ min: 1 }).withMessage('Select at least one category'),
  body('consent').custom(value => value === true).withMessage('Consent is required to continue'),
];

// POST /api/leads
// Stores (or updates) a lead's details — no login/session involved.
router.post('/', leadValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, phone, ageGroup, gender, city, country, categories, consent } = req.body as {
    name: string;
    email: string;
    phone: string;
    ageGroup: string;
    gender: string;
    city: string;
    country: string;
    categories: string[];
    consent: boolean;
  };

  try {
    const lead = await prisma.lead.upsert({
      where: { email },
      create: { name, email, phone, ageGroup, gender, city, country, categories, consent },
      update: { name, phone, ageGroup, gender, city, country, categories, consent },
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

// GET /api/leads/export
// Every lead who filled out the gate form, as a downloadable CSV. Requires
// the x-admin-key header — see requireAdminKey.
router.get('/export', requireAdminKey, async (_req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });

    const header = CSV_COLUMNS.join(',');
    const rows = leads.map(lead =>
      [
        lead.name,
        lead.email,
        lead.phone,
        lead.ageGroup,
        lead.gender,
        lead.city,
        lead.country,
        lead.categories.join('; '),
        lead.createdAt.toISOString(),
      ]
        .map(csvCell)
        .join(',')
    );
    const csv = [header, ...rows].join('\r\n');

    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error('Lead export error:', err);
    res.status(500).json({ error: 'Could not export leads' });
  }
});

export default router;
