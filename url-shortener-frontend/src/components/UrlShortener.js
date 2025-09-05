import React, { useState } from 'react';
import apiClient from '../api/config';

const UrlShortener = ({ onUrlCreated }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!originalUrl) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Sending request to shorten URL:', originalUrl);
      
      const response = await apiClient.post('/api/urls/shorten', {
        originalUrl: originalUrl.trim()
      });
      
      console.log('Response received:', response.data);
      
      setShortUrl(response.data.shortUrl);
      setOriginalUrl('');
      
      if (onUrlCreated) {
        onUrlCreated();
      }
      
    } catch (error) {
      console.error('Error shortening URL:', error);
      
      if (error.response) {
        setError(`Server Error: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        setError('Network Error: Cannot connect to server. Make sure backend is running on port 5001.');
      } else {
        setError(`Error: ${error.message}`);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="url-shortener">
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter URL to shorten (e.g., https://www.google.com)"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="error">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      )}
      
      {shortUrl && (
        <div className="result">
          <p><strong>Short URL:</strong></p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
          <button 
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
