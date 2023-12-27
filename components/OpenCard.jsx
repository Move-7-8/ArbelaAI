import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from 'next/link';
import StatementSelect from './StatementSelect';
import NewsSelect from './NewsSelect.jsx';
import ComparativeSelect from './ComparativeSelect.jsx';

function OpenCard({ company, onClose }) {

  const linkPath = {
      pathname: `/companies/${company['Company name'].toLowerCase().replace(/ /g, '')}`,
      query: {
          companyName: company['Company name'],
          ticker: company.ASX_code,
          industry: company['GICsindustrygroup'],
          price: company['Price'],
          change: (company['Change (%)'] / company['Price']).toFixed(2)
      }
  };


    return (
        <Transition appear show={Boolean(company)} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={onClose}
            >
                <div className="min-h-screen px-4 text-center">
                    <Dialog.Overlay 
                        className="fixed inset-0 transition-opacity"
                        style={{
                            backdropFilter: 'blur(5px)',
                            background: 'rgba(255, 255, 255, 0.8)',
                            backgroundImage: 'linear-gradient(45deg, rgba(255,0,150,0.1), rgba(0,219,222,0.1))',
                        }}
                    />

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            className="inline-block overflow-hidden text-left align-middle transition-all transform bg-white/60 shadow-xl rounded-2xl relative"
                            style={{
                                width: '80vw',
                                height: '80vh',
                                margin: '10vh auto', // Center the card vertically
                            }}
                        >

                            <div className="p-6 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                                <div className="flex justify-start items-center mt-8">
                                    <h2 className="text-lg font-semibold tracking-tight text-gray-900 mr-4">
                                        {company['Company name']}
                                    </h2>
                                    <p className="text-xl text-gray-900 mr-4">
                                        ${company['Price']}
                                    </p>
                                    <span className={`text-xl ${((company['Change (%)'] / company['Price']) >= 0) ? 'text-green-500' : 'text-red-500'}`}>
                                        {(company['Change (%)'] / company['Price']).toFixed(2)}%
                                    </span>
                                </div>
                                <p className="w-16 bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-1 py-0.5 rounded ml-0 mt-2">
                                    {company.ASX_code}:ASX
                                </p>
                                <p className="text-sm text-gray-900 mt-2 mb-5">
                                    {company['GICsindustrygroup']}
                                </p>
                                <Link href={linkPath} className="company_button">
                                    Analyse Company
                                </Link>
                                <div className="mt-10">
                                    <StatementSelect 
                                        company={company['Company name']}
                                        ticker={company.ASX_code}
                                        industry={company['GICsindustrygroup']}
                                    />
                                </div>

                                <div className="mt-8">
                                    <NewsSelect 
                                        company={company['Company name']}
                                        ticker={company.ASX_code}
                                        industry={company['GICsindustrygroup']}
                                    />
                                </div>

                                <div className="mt-8 mb-20">
                                    <ComparativeSelect 
                                        company={company['Company name']}
                                        ticker={company.ASX_code}
                                        industry={company['GICsindustrygroup']}
                                    />
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

export default OpenCard;
