import express from 'express';
import Stray from '../models/Stray.js';

const router = express.Router();

// Get all strays
router.get('/', async (req, res) => {
    try {
        const strays = await Stray.find().sort({ createdAt: -1 });
        res.json(strays);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching strays', error });
    }
});

// Create a new stray (for reporting/seeding)
router.post('/', async (req, res) => {
    try {
        const newStray = new Stray(req.body);
        const savedStray = await newStray.save();
        res.status(201).json(savedStray);
    } catch (error) {
        res.status(400).json({ message: 'Error creating stray', error });
    }
});

// Submit survey and update sterilization status
router.put('/:id/survey', async (req, res) => {
    try {
        const { surveyData } = req.body;
        const isSterilized = surveyData.earsNotched === 'yes' || surveyData.surgicalMarks === 'yes';

        const updatedStray = await Stray.findByIdAndUpdate(
            req.params.id,
            {
                surveyData,
                isSterilized
            },
            { new: true }
        );

        if (!updatedStray) {
            return res.status(404).json({ message: 'Stray not found' });
        }

        res.json(updatedStray);
    } catch (error) {
        res.status(400).json({ message: 'Error updating survey', error });
    }
});

export default router;
