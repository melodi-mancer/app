import React, { useState, useEffect, use } from 'react';
import './content/css/App.scss';
import Header from './components/header';
import Footer from './components/footer';
import Result from './components/result';
import { spotifyClient } from './spotifyClient';

function App() {
  const [data, setData] = useState('');

  useEffect(async () => {
    await spotifyClient.authenticate();

    let data = JSON.parse(localStorage.getItem("spotify-data"));

    if (data) {
      setData(data)
    }
  }, [])

  return (
    <div className="page-container">
      <div className='top'>
        <Header></Header>
      </div>
      <div className="main">
        <div className='results-container'>
          <Result data={data}></Result>
        </div>
      </div>
      <div className="bottom"><Footer></Footer></div>
    </div>
  );
}

export default App;