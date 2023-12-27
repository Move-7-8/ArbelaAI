import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';


const PlanCard = ({
    name, 
    description, 
    price, 
    features, 
    color, 
    btnText,
    href
}) => {
  return (
    <div 
    style={{backgroundColor: color}} 
    className="flex min-h-[428px] w-[320px] flex-col rounded-3xl p-8">
        <h2 className="mb-5 text-xl font-medium" >{name}</h2>
        <div className="mb-5 flex items-end text-6xl font-black">
            {price ? (
                <>
                    <div>
                        <span>${price}</span>
                        <span className='text-3xl'>/mo</span>
                    </div>
                </>
            ) : (
                'Free'
            )
        }
        </div>
        <p className='mb-5 '>{description}</p>
        <ul className='mb-10 flex flex-col gap-y-2'>
    {features.map((feature, index) => (
            <li key={index} className="flex items-center">
                <FontAwesomeIcon icon={faSquareCheck} className='mr-3 h-7 w-7' />
                {feature}
            </li>
    ))}
        </ul>
            <a 
                href={href} 
                className="mt-auto rounded-xl bg-black py-3 px-6 text-lg font-medium text-white inline-block text-center no-underline" // Add your button styles here
                role="button" // This helps with accessibility
                >
                {btnText}
            </a>
    </div>
 )
}

export default PlanCard;
