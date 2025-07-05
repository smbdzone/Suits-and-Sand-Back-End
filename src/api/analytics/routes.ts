// backend/routes/analytics.ts

import express from 'express';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const keyPath = path.join(__dirname, '..', 'analytics-credentials.json');
const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials,
});

router.get('/analytics', async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: 'properties/YOUR_GA4_495390133', // 🔁 Replace with your ID
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
    });

    const formatted = response.rows?.map(row => ({
      name: row.dimensionValues?.[0].value,
      value: parseFloat(row.metricValues?.[0].value || '0'),
    })) || [];

    res.json({ data: formatted });
  } catch (error) {
    console.error('GA Error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
