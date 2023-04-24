import React from 'react'

interface Props {

}

const StakingStatsPersonal: React.FC<Props> = () => {
    return (
        <section className="lg:mt-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5    mt-12 gap-y-6 gap-x-6 text-white">
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>$91.58</h1>
                <h3>USDC Staked Value</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>$77.01</h1>
                <h3>USDC Staked</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>$15.29</h1>
                <h3>Staked PNL</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>$12.05</h1>
                <h3>Cummulative Rewards Collected</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>$2.88</h1>
                <h3>Rewards to be Claimed</h3>
            </div>


        </section>
    )
}

export default StakingStatsPersonal
