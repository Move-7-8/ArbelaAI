// Landing component
import Image from "next/image";
import InvestorLogos from "@components/InvestorLogos";
import Features from "./Features";
import CronTest from '@components/CronTest'
import AssistantTest from '@components/Test'
import EdgarTest from '@components/EdgarTest'
import Footer from "@components/Footer";
import { FaAngleDoubleDown } from 'react-icons/fa'; // Corrected import if the name was wrong

const Landing = ({ setIsLandingVisible }) => {
    return (
        <div className="w-4/5 mt-10">
            <Features/>
            
            {/* Flexbox container for the button */}
            <div className="flex justify-center mt-10 mb-10">
                <button 
                    className="analyse_button" 
                    onClick={() => setIsLandingVisible(false)}> 
                    Try It
                    <FaAngleDoubleDown size={17} className="text-[#3A3C3E] mb-2 FaAngleDoubleDown" />

                </button>

            </div>
            
            <h2 className="text-gray-500 uppercase text-md mb-4 mt-16">Supported By</h2>
            <InvestorLogos/>
            <Footer />
        </div>
    )
}

export default Landing;
