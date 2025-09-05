import React, { useState } from 'react';
import UrlShortener from './components/UrlShortener';
import UrlList from './components/UrlList';
import './App.css';

function App() {
  const [refreshList, setRefreshList] = useState(0);

  const handleUrlCreated = () => {
    setRefreshList(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>URL Shortener</h1>
      </header>
      <main>
        <UrlShortener onUrlCreated={handleUrlCreated} />
        <UrlList refresh={refreshList} />
      </main>
    </div>
  );
}

export default App;
