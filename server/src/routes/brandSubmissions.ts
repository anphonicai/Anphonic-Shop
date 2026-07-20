import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';

const router = Router();

const stripTags = (value: string) => value.replace(/<[^>]*>/g, '');

const submissionValidation = [
  body('brandName').trim().customSanitizer(stripTags).notEmpty().withMessage('Brand name is required').isLength({ max: 100 }),
  body('website').trim().customSanitizer(stripTags).notEmpty().withMessage('Website is required').isLength({ max: 200 }),
  body('contactName').trim().customSanitizer(stripTags).notEmpty().withMessage('Contact name is required').isLength({ max: 100 }),
  body('contactEmail').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('contactPhone').trim().notEmpty().withMessage('Phone number is required').isLength({ max: 20 }),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('description').trim().customSanitizer(stripTags).notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
  body('offerDetails').trim().customSanitizer(stripTags).notEmpty().withMessage('Offer details are required').isLength({ max: 1000 }),
];

// POST /api/brand-submissions
// Brands apply to be listed on the index — reviewed manually before going live.
router.post('/', submissionValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { brandName, website, contactName, contactEmail, contactPhone, category, description, offerDetails } = req.body as {
    brandName: string;
    website: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    category: string;
    description: string;
    offerDetails: string;
  };

  try {
    const submission = await prisma.brandSubmission.create({
      data: { brandName, website, contactName, contactEmail, contactPhone, category, description, offerDetails },
    });

    res.status(200).json({ submission: { id: submission.id, brandName: submission.brandName } });
  } catch (err) {
    console.error('Brand submission save error:', err);
    res.status(500).json({ error: 'Could not submit your brand. Please try again.' });
  }
});

export default router;
