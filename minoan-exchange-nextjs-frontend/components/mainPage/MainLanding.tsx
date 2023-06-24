import React from 'react'

interface Props {
    
}

const MainLanding: React.FC<Props> = () => {
    return (
        <div className="md:col-span-3 lg:col-span-1  flex flex-col  mt-24 gap-y-4 justify-center text-center">
        <h1 className="text-2xl 2xl:text-3xl text-white">
          MINOAN EXCHANGE
        </h1>
        <h3 className="xl:text-xl 2xl:text-2xl">
          A Perpetual stock exchange
        </h3>
        <p className="text-white text-xs lg:text-lg lg:mb-8  xl:text-md    ">
          Trade s&p500 stocks using P2P funds
          with USDC, to short or long stocks.
        </p>

        <div className="flex flex-wrap justify-evenly md:gap-x-2 gap-y-3  2xl:mx-24 2xl:text-lg 2xl:my-8 2xl:gap-x-0 2xl:gap-y-4">
          <p className="p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125">How to trade</p>
          <p className="p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125">Loan Pools</p>
          <p className="p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125">Join the Thesus DOA</p>
          <p className="p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125">Thesus DOA</p>
          <p className="p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125">Ariadne Pools</p>
          <p className="p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125">White Paper</p>
          <p className="p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125">Docs</p>
        </div>
      </div>
    )
}

export default MainLanding
