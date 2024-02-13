import React from 'react';
import Image from 'next/image';

const Features = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-between'> 
      <div className='w-full sm:flex-1 feature p-4 m-2'> 
        <h3 className="features-header mb-4 font-bold">
          Our Data
        </h3>
        <Image 
          src="/assets/icons/features/data2.png"
          width={100}
          height={100}
          alt="Unstructured Data"
        />
        <p style={{ marginTop: '1rem' }}>
          Our Data covers live feeds, quarterly updates, news stories, and metrics for all ASX traded stocks.
        </p>
      </div>
      <div className='w-full sm:flex-1 feature p-4 m-2'> 
        <h3 className="features-header mb-4 font-bold">
          Find Companies
        </h3>
        <Image 
          src="/assets/icons/features/model2.png"
          width={100}
          height={100}
          alt="Structured Data"
        />
        <p style={{ marginTop: '1rem' }}>
          Use AI to search and filter companies based on your investment goals. Coming soon.
        </p>
      </div>
      <div className='w-full sm:flex-1 feature p-4 m-2'> 
        <h3 className="features-header mb-4 font-bold">
          Analyse Companies
        </h3>
        <Image 
          src="/assets/icons/features/analytics2.png"
          width={100}
          height={100}
          alt="Analysed Data"
        />
        <p style={{ marginTop: '1rem' }}>
          Anlyse company data via our models that have been trained on each individual stock.
        </p>
      </div>
    </div>
  )
}


export default Features;
