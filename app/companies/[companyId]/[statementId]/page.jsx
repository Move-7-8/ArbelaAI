// 'use client';

// import dynamic from 'next/dynamic';
// import { useSearchParams } from 'next/navigation';
// import PdfReader from '@components/PdfReader';
// import ChatBox from '@components/ChatBox';

// const Page = () => {
//   const searchParams = useSearchParams();
//   const pdfUrl = "https://clients3.weblink.com.au/pdf/DCC/02691040.pdf";

//   // Check if the router is ready before accessing the query parameters
//   const company = searchParams.get('company');
//   const ticker = searchParams.get('ticker');
//   const industry = searchParams.get('industry');
//   const quarter = searchParams.get('quarter');

//   return (
// <div className="company_page flex flex-col">
    {/* <div className="company_content flex flex-col items-center w-full bg-opacity-60 backdrop-blur-md ">
        <div className="flex items-center justify-center w-full h-min bg-opacity-60 backdrop-blur-md  p-4  rounded-md flex-shrink-0">
            <div className="text-black-100 flex flex-wrap items-center justify-center">
                {company && (
                    <a href="#" className="mr-4" style={{ height: '30px' }}>
                        <h5 className="text-lg font-semibold tracking-tight text-gray-900 capitalize">
                            {company.replace(/\+/g, ' ')}
                        </h5>
                    </a>
                )}
                {ticker && (
                    <div className="flex items-center justify-center mr-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 rounded capitalize">
                            {ticker}:ASX
                        </span>
                    </div>
                )}
                {industry && (
                     <div className="flex items-center justify-center mr-4" style={{ height: '25px' }}>
                       <span className="text-sm text-gray-900 capitalize">
                            {industry.replace(/%2C/g, ', ').replace(/\+/g, ' ')}
                        </span>
                    </div>
                )}
                {quarter && (
                    <div className="flex items-center justify-center" style={{ height: '25px' }}>
                         <span className="text-sm text-gray-900 capitalize">
                    {" "}{quarter.replace(/%2C/g, ', ').replace(/\+/g, ' ')}
                        </span>
                    </div>
                )}
            </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full justify-center gap-2 overflow-y-auto">
        <div className="flex-grow w-full lg:w-1/2 xl:w-1/3 h-full bg-opacity-60 backdrop-blur-md border border-gray-300 p-4 rounded-md order-2 lg:order-1 overflow-y-auto">
            <PdfReader pdfUrl={pdfUrl}/>
        </div>
        <div className="flex-grow w-full lg:w-1/2 xl:w-1/3 h-full bg-opacity-60 backdrop-blur-md border border-gray-300 p-4 rounded-md order-1 lg:order-2 overflow-y-auto">
            <ChatBox company={company} quarter={quarter} pdfUrl={pdfUrl}/>
        </div>
        </div>
    </div> */}
// </div>
//   );
// };

// export default Page;
