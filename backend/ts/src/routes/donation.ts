import express from 'express';
import Donation from '../models/Donation.ts';

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
    const totalRaised = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const donorCount = await Donation.countDocuments();
    const recentDonations = await Donation.find()
      .sort({ donatedAt: -1 })
      .limit(5);

    res.json({
      totalRaised: totalRaised[0]?.total || 0,
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
    
    if (!name || !email || !amount) {
      return res.status(400).json({ error: 'Name, email, and amount are required' });
    }

    const donation = new Donation({
      name,
      email,
      amount: parseFloat(amount),
    });

    await donation.save();
    res.status(201).json({ message: 'Donation created successfully', donation });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ error: 'Failed to create donation' });
  }
});

export default router;