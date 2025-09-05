const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

const router = express.Router();

// Create short URL
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;
    
    console.log('Received URL to shorten:', originalUrl);
    
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }
    
    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(originalUrl)) {
      return res.status(400).json({ error: 'Please provide a valid URL starting with http:// or https://' });
    }
    
    // Check if URL already exists
    let url = await Url.findOne({ originalUrl });
    
    if (url) {
      console.log('URL already exists:', url);
      return res.json(url);
    }
    
    // Generate short code
    const urlCode = nanoid(8);
    const shortUrl = `${process.env.BASE_URL || 'http://localhost:5001'}/${urlCode}`;
    
    // Create new URL
    url = new Url({
      originalUrl,
      shortUrl,
      urlCode
    });
    
    await url.save();
    console.log('New URL created:', url);
    
    res.json(url);
    
  } catch (error) {
    console.error('Error in /shorten:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
});

// Get all URLs
router.get('/', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    console.log(`Returning ${urls.length} URLs`);
    res.json(urls);
  } catch (error) {
    console.error('Error in GET /:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
});

// Redirect to original URL
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    console.log('Looking for URL with code:', code);
    
    const url = await Url.findOne({ urlCode: code });
    
    if (!url) {
      console.log('URL not found for code:', code);
      return res.status(404).json({ error: 'URL not found' });
    }
    
    // Increment clicks
    url.clicks++;
    await url.save();
    
    console.log(`Redirecting to: ${url.originalUrl}, clicks: ${url.clicks}`);
    return res.redirect(url.originalUrl);
    
  } catch (error) {
    console.error('Error in redirect:', error);
    res.status(500).json({ error: 'Server error occurred' });
  }
});

module.exports = router;
