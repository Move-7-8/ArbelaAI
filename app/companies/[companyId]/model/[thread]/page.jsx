'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import PdfReader from '@components/PdfReader';
import ChatBox from '@components/ChatBox';
import ThreadAssistant from '@components/ThreadAssistant';
import { useState, useEffect} from 'react'; // Import useState from React
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const Page = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const pdfUrl = "https://clients3.weblink.com.au/pdf/DCC/02691040.pdf";

    const [showPdfReader, setShowPdfReader] = useState(false);
    const [threadId, setThreadId] = useState(''); // Initialize state for threadId

  // Check if the router is ready before accessing the query parameters
    const company = searchParams.get('companyName');
    // const ticker = searchParams.get('ticker');
    // const industry = searchParams.get('industry');
    // const quarter = searchParams.get('quarter');
    const selectedDocumentsStr = searchParams.get('selectedDocuments');
    const selectedDocuments = selectedDocumentsStr ? JSON.parse(decodeURIComponent(selectedDocumentsStr)) : [];
    const toggleComponent = () => {
        setShowPdfReader(!showPdfReader);
    };

    useEffect(() => {
        // Parse pathname to extract threadId
        const pathSegments = pathname.split('/');
        const extractedThreadId = pathSegments[pathSegments.length - 1];
        setThreadId(extractedThreadId);
    }, [pathname]);



  return (
    <div className="company_page flex flex-col h-screen">
        <div className="text-black-100 flex flex-wrap items-center justify-center">
            {company && (
                <a href="#" className="mr-4" style={{ height: '30px' }}>
            <h5 className="text-lg font-semibold tracking-tight text-gray-900 capitalize">
                {company.replace(/\+/g, ' ')}
            </h5>
                </a>
            )}
            <div className="toggle-switch">
                <FormControlLabel
                    control={
                    <Switch
                        checked={showPdfReader}
                        onChange={toggleComponent}
                        name="showPdfReader"
                    />
                    }
                    label={showPdfReader ? 'Show Assistant' : 'Show PDF Reader'}
                />
            </div>
        </div>
        <div className="h-full ">
            <div className={`h-[750px] w-full  ${showPdfReader ? 'block' : 'hidden lg:hidden'}  bg-opacity-60 backdrop-blur-md border border-gray-300 p-4 rounded-md overflow-y: auto; `}>
                <PdfReader pdfUrl={pdfUrl} selectedDocuments={selectedDocuments} />
            </div>
            <div className={`h-[750px] w-full ${showPdfReader ? 'hidden lg:hidden' : 'block'} ] bg-opacity-60 backdrop-blur-md border border-gray-300  rounded-md overflow-y: auto; `}>
                <ThreadAssistant companyName={company} selectedDocuments={selectedDocuments} threadnumber={threadId}/>
            </div>
        </div>
    </div>
    );
};

export default Page;
