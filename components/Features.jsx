import React from 'react';
import Image from 'next/image';

const Features = () => {
  return (
    <div className='features flex justify-between'> 
      <div className='flex-1 feature p-4 m-2'> 
      <h3 className="mb-4 font-bold">
          Data Feeds
        </h3>
        <Image 
          src="/assets/icons/features/grid.png"
          width={90}
          height={90}
          alt="Unstructured Data"
        />
        <p style={{ marginTop: '1rem' }}>
           Our Data covers company statements, quarterly updates, news stories, and price movements for all US stocks.
        </p>
      </div>
      <div className='flex-1 feature p-4 m-2'> 
      <h3 className="mb-4 font-bold">
          Train Your own Model
        </h3>
        <Image 
          src="/assets/icons/features/pentagon.png"
          width={90}
          height={90}
          alt="Structured Data"
        />
        <p style={{ marginTop: '1rem' }}>
           You can choose multiple data points to train your model on.
        </p>
      </div>
      <div className='flex-1 feature p-4 m-2'> 
        <h3 className="mb-4 font-bold">
          Analyse Companies
        </h3>
        <Image 
          src="/assets/icons/features/torus.png"
          width={90}
          height={90}
          alt="Analysed Data"
        />
        <p style={{ marginTop: '1rem' }}>
          Quickly extract information by talking with your model
        </p>
      </div>
    </div>
  )
}

export default Features;
