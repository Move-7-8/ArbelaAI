import PlanCard from '@components/PlanCard'

const page = () => {
  return (
    <div className='mt-14 w-full'>
        <div className='flex flex-col items-center  p-4 w-full'>
            <div className='mb-2 mt-12 text-center'>
                <h1 className='mb-4 text-7xl font-black text-black'>Pricing</h1>
                <p className='text-lg text-black'
                >Choose the right pricing for you or your company 
                </p>
            </div>
            <div className='flex flex-col gap-8 p-10 lg:flex-row'>
                <PlanCard 
                color='rgba(120, 227, 252, 0.2)' // 50% opacity
                name='Free' 
                description='Get started with the free plan' 
                features={['1 Datapoint per model', 'GPT 3.5', 'Limited Datapoint Selection']} 
                btnText='Start Free Plan'
                href=''
                />

                <PlanCard 
                color='rgba(252, 214, 56, 0.2)' // 50% opacity
                name='Pro' 
                description='Get more advanced' 
                price='30'
                features={['5 Datapoints per model', 'GPT 3.5', 'Unlimited Datapoint Selection']} 
                btnText='Start Pro Plan'
                href='https://buy.stripe.com/cN2bLdd419iO2Xu28a'
                />

                <PlanCard 
                color='rgba(255, 181, 186, 0.2)' // 50% opacity 
                name='Enterprise' 
                description='For Enterprise Users' 
                price='80'
                features={['Unlimited Datatpoints per Model', 'GPT 4', 'Unlimited Datapoint Selection']} 
                btnText='Start Enterprise Plan'
                href='https://buy.stripe.com/28obLd4xv7aGapW4gh'
                />
            </div>
        </div>
    </div>
  )
}

export default page