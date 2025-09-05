import React, { useState, useEffect } from 'react';
import apiClient from '../api/config';

const UrlList = ({ refresh }) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUrls();
  }, [refresh]);

  const fetchUrls = async () => {
    try {
      setError('');
      console.log('Fetching URLs...');
      
      const response = await apiClient.get('/api/urls');
      console.log('URLs fetched:', response.data);
      
      setUrls(response.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      
      if (error.response) {
        setError(`Server Error: ${error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        setError('Network Error: Cannot connect to server.');
      } else {
        setError(`Error: ${error.message}`);
      }
    }
    setLoading(false);
  };

  if (loading) return <div>Loading URLs...</div>;

  if (error) {
    return (
      <div className="url-list">
        <h3>Your Shortened URLs</h3>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={fetchUrls}>Retry</button>
      </div>
    );
  }

  return (
    <div className="url-list">
      <h3>Your Shortened URLs</h3>
      {urls.length === 0 ? (
        <p>No URLs shortened yet</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Original URL</th>
                <th>Short URL</th>
                <th>Clicks</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr key={url._id}>
                  <td>
                    <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                      {url.originalUrl.length > 50 
                        ? url.originalUrl.substring(0, 50) + '...' 
                        : url.originalUrl}
                    </a>
                  </td>
                  <td>
                    <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                      {url.shortUrl}
                    </a>
                  </td>
                  <td>{url.clicks}</td>
                  <td>{new Date(url.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UrlList;
