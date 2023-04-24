import React from 'react'

interface Props {

}

const InvestmentStats: React.FC<Props> = () => {
    return (
        <section className="lg:mt-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7   mt-12 gap-y-6 gap-x-6 text-white">

            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>$29.88</h1>
                <h3>Cummulative USDC Invested </h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>24</h1>
                <h3># Investments Made</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>$290.88</h1>
                <h3>USDC Currently Invested</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>3</h1>
                <h3># Active Trades</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>$389.28</h1>
                <h3>Collateral</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>$916.88</h1>
                <h3>Total PNL</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                <h1>$29.88</h1>
                <h3>Current PNL</h3>
            </div>

        </section>
    )
}

export default InvestmentStats
