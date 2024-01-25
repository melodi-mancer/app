import React, { useState, useEffect, use } from 'react';
import './content/css/App.scss';
import Header from './components/header';
import Footer from './components/footer';
import Result from './components/result';
import Analysis from './components/analysis';
import { spotifyClient } from './spotifyClient';

function App() {
  const [spotifyData, setSpotifyData] = useState('');
  const [analysisData, setAnalysisData] = useState('');

  useEffect(async () => {
    await spotifyClient.authenticate();

    let spotifyData = JSON.parse(localStorage.getItem("spotify-data"));

    if (spotifyData) {
      setSpotifyData(spotifyData)
    }

    let analysisData = JSON.parse(localStorage.getItem("analysis-data"));

    if (analysisData) {
      setAnalysisData(analysisData)
    }
  }, [])

  return (
    <div className="page-container">
      <div className='top'>
        <Header></Header>
      </div>
      <div className="main">
        <div className='results-container'>
          <Result data={spotifyData}></Result>
        </div>
        <div className='stats-container'>
          <Analysis data={analysisData}></Analysis>
        </div>
      </div>
      <div className="bottom"><Footer></Footer></div>
    </div>
  );
}

export default App;