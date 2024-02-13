'use client'

import { CSSTransition } from 'react-transition-group';
import Feed from '@components/Feed';
import Landing from '@components/Landing';
import { useState, useEffect } from 'react';

const Home = () => {
  const [isLandingVisible, setIsLandingVisible] = useState(true);
  const [preloadedData, setPreloadedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add this line

  const toggleShowFeed = () => {
    setIsLandingVisible(false);
  };

  useEffect(() => {
    setIsLandingVisible(true);
  }, []);

 
  const preloadData = async () => {
    setIsLoading(true); // Start loading
    try {
      const limit = 12; // Load initial 12 items
      const response = await fetch(`/api/companies?limit=${limit}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPreloadedData(data);
    } catch (error) {
      console.error("Fetch error: ", error);
    } finally {
      setIsLoading(false); // End loading regardless of outcome
    }
  };
      
  useEffect(() => {
    preloadData(); // Trigger data preloading on component mount
  }, []);


  return (
    <section className="w-full flex-center flex-col mt-20 pt-10">
      <h1 className="head_text text-center">
        <div className="landing-header text-center">Perform AI Powered Research</div>
        <div className="landing-header text-center"> On The Stock Market</div>
      </h1>
      {/* <p className='desc text-center'>
        Build your own models with stock market data.
      </p> */}
      <CSSTransition
        in={isLandingVisible}
        timeout={1}
        classNames="fade"
        unmountOnExit
        onExited={() => setIsLandingVisible(false)}
      >
        <Landing setIsLandingVisible={setIsLandingVisible} />
        
      </CSSTransition>
      <CSSTransition
        in={!isLandingVisible}
        timeout={2500}
        classNames="fade"
        unmountOnExit
      >
        {!isLoading ? <Feed preloadedData={preloadedData} /> : <div>Loading...</div>}
      </CSSTransition>

    </section>
  );
};

export default Home;
