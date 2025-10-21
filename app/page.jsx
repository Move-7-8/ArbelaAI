"use client";

import { CSSTransition } from "react-transition-group";
import Feed from "@components/Feed";
import Landing from "@components/Landing";
import { useState, useEffect } from "react";

/* UTM-tagged link to Kali Software (for GA4 reporting) */
const KALI_UTM_URL =
  "https://www.kalisoftware.io/?utm_source=arbela&utm_medium=referral&utm_campaign=cross-promo&utm_content=mini_badge";

const Home = () => {
  //Set to True to show home page pt.1
  const [isLandingVisible, setIsLandingVisible] = useState(true);
  const [preloadedData, setPreloadedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add this line
  const [isScreenLarge, setIsScreenLarge] = useState(false); // Default to false

  useEffect(() => {
    const checkIfScreenLarge = () => window.innerWidth > 1024;
    // Set initial value
    setIsScreenLarge(checkIfScreenLarge());

    const handleResize = () => {
      setIsScreenLarge(checkIfScreenLarge());
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleShowFeed = () => {
    setIsLandingVisible(false);
  };

  //Set to True to show home page pt.2
  useEffect(() => {
    setIsLandingVisible(true);
  }, []);

  const preloadData = async () => {
    setIsLoading(true); // Start loading
    try {
      const limit = 12; // Load initial 12 items
      const response = await fetch(`/api/companies?limit=${limit}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    <section
      className={`w-full ${
        isLandingVisible || isScreenLarge ? "flex-center" : ""
      } flex-col mt-20 pt-10`}
    >
      <h1 className="head_text text-center">
        <div className="landing-header text-center">
          Perform AI Powered Research
        </div>
        <div className="landing-header text-center"> On The Stock Market</div>
      </h1>

      {/* Tiny attribution line with UTM */}
      <p className="text-xs text-center mt-2 opacity-70">
        <a
          href={KALI_UTM_URL}
          className="underline underline-offset-4 hover:no-underline"
          rel="noopener"
          title="Kali Software"
        >
          Built by Kali Software
        </a>
      </p>

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
        <Feed preloadedData={preloadedData} />
        {/* {!isLoading ? <Feed preloadedData={preloadedData} /> : <div>Loading...</div>} */}
      </CSSTransition>
    </section>
  );
};

export default Home;
