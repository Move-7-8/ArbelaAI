// Landing component
import Image from "next/image";
import InvestorLogos from "@components/InvestorLogos";
import Features from "./Features";
import CronTest from '@components/CronTest'
import AssistantTest from '@components/Test'
import EdgarTest from '@components/EdgarTest'

const Landing = ({ setIsLandingVisible }) => {
    return (
        <div className="w-4/5 mt-10">
            <Features/>
            
            {/* Flexbox container for the button */}
            <div className="flex justify-center mt-10 mb-10">
                <button 
                    className="analyse_button" 
                    onClick={() => setIsLandingVisible(false)}> 
                    Try It (FREE)
                </button>
            </div>
            
            <h2 className="text-gray-500 uppercase text-md mb-4 mt-4">Supported By</h2>
            <InvestorLogos/>
            {/* <CronTest/>
            <EdgarTest /> */}
        </div>
    )
}

export default Landing;
