import Link from 'next/link';

function StockCard({ company }) {
    // Function to truncate the company name if it's too long
    const truncateCompanyName = (name) => {
        return name.length > 20 ? name.substring(0, 20) + "..." : name;
    };

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
        <Link 
            href={linkPath} 
            className="cursor-pointer transform transition-transform duration-200 hover:scale-105 w-full max-w-sm mx-auto bg-white/30 border border-gray-200 rounded-lg shadow flex flex-col"
        >
            <div className="px-5 mt-5 flex-grow flex flex-col justify-between">
                <div className="" style={{ height: '30px' }}>
                    <h5 className="text-lg font-semibold tracking-tight text-gray-900">
                        {truncateCompanyName(company['Company name'])}
                    </h5>
                </div>
                <div className="flex items-center mb-5" style={{ height: '25px' }}>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 rounded">
                        {company.ASX_code}:ASEX
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="text-xl text-gray-900 mr-4">
                        ${company['Price']}
                    </span>
                    <span className={`text-xl ${((company['Change (%)'] / company['Price']) >= 0) ? 'text-green-500' : 'text-red-500'}`}>
                        {(company['Change (%)'] / company['Price']).toFixed(2)}%
                    </span>
                </div>
                <div className="mb-10" style={{ height: '25px' }}>
                    <span className="text-sm text-gray-900">
                        {company['GICsindustrygroup']}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default StockCard;
