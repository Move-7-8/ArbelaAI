// Landing component
import Image from "next/image";
import InvestorLogos from "@components/InvestorLogos";
import Features from "./Features";
import Test from '@components/test'

const Landing = ({ setIsLandingVisible }) => {
    return (
        <div className="w-4/5 mt-10">
            <Features/>
            
            {/* Flexbox container for the button */}
            <div className="flex justify-center mt-10 mb-10">
                <button 
                    className="analyse_button" 
                    onClick={() => setIsLandingVisible(false)}> 
                    Get Started 
                </button>
            </div>
            
            <h2 className="text-l font-bold">Supported By</h2>
            <InvestorLogos/>
            <Test/>
        </div>
    )
}

export default Landing;
