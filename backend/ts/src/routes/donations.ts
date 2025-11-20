import express from 'express';
import Donation from '../models/Donation.js';

const router = express.Router();

// Get all donations (for stats)
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ donatedAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// Get donation statistics
router.get('/stats', async (req, res) => {
  try {
    // Calculate total raised
    const totalRaisedResult = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalRaised = totalRaisedResult[0]?.total || 0;

    // Count total donors
    const donorCount = await Donation.countDocuments();

    // Get recent donations (last 5)
    const recentDonations = await Donation.find()
      .sort({ donatedAt: -1 })
      .limit(5)
      .select('name amount donatedAt _id');

    res.json({
      totalRaised,
      donorCount,
      recentDonations,
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ error: 'Failed to fetch donation stats' });
  }
});

// Create a new donation
router.post('/', async (req, res) => {
  try {
    const { name, email, amount } = req.body;

    // Validation
    if (!name || !email || !amount) {
      return res.status(400).json({ error: 'Name, emailand amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Create new donation
    const donation = new Donation({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      amount: parseFloat(amount),
    });

    await donation.save();

    console.log('New donation created:', { name, email, amount });

    res.status(201).json({
      message: 'Donation created successfully',
      donation: {
        _id: donation._id,
        name: donation.name,
        email: donation.email,
        amount: donation.amount,
        donatedAt: donation.donatedAt
      }
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ error: 'Failed to create donation' });
  }
});

export default router;