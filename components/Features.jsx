import React from 'react';
import Image from 'next/image';

const Features = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-between'> 
      <div className='w-full sm:flex-1 feature p-4 m-2'> 
        <h3 className="features-header mb-4 font-bold">
          Data Feeds
        </h3>
        <Image 
          src="/assets/icons/features/data2.png"
          width={100}
          height={100}
          alt="Unstructured Data"
        />
        <p style={{ marginTop: '1rem' }}>
          Our Data covers company statements, quarterly updates, news stories, and price movements for all US stocks.
        </p>
      </div>
      <div className='w-full sm:flex-1 feature p-4 m-2'> 
        <h3 className="features-header mb-4 font-bold">
          Train Your own Model
        </h3>
        <Image 
          src="/assets/icons/features/model2.png"
          width={100}
          height={100}
          alt="Structured Data"
        />
        <p style={{ marginTop: '1rem' }}>
          You can choose multiple data points to train your model on.
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
          Quickly extract information by talking with your model
        </p>
      </div>
    </div>
  )
}


export default Features;
