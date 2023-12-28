import React from 'react'

const Test = () => {
  const handleClick = () => {
    fetch('/api/stock_info?ticker=AAPL')
      .then(res => res.json())
      .then(data => {
        // Use the data from the Python script
        console.log(data);
      });
  };

  return (
    <div>
      <button onClick={handleClick}>test</button>
    </div>
  );
};

export default Test;

