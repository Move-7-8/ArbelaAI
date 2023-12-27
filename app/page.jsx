'use client'

import { CSSTransition } from 'react-transition-group';
import Feed from '@components/Feed';
import Landing from '@components/Landing';
import { useState, useEffect } from 'react';

const Home = () => {
  const [isLandingVisible, setIsLandingVisible] = useState(true);

  const toggleShowFeed = () => {
    setIsLandingVisible(false);
  };

  useEffect(() => {
    setIsLandingVisible(true);
  }, []);


  return (
    <section className="w-full flex-center flex-col mt-20 pt-10">
      <h1 className="head_text text-center">
        <div className="text-center">Perform AI Powered Research</div>
        <div className="new_blue_gradient text-center"> On The Stock Market</div>
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
        <Feed />
      </CSSTransition>

    </section>
  );
};

export default Home;
