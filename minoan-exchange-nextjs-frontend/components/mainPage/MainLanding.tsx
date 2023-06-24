import ScrollUp from 'components/utils/ScrollUp'
import React from 'react'

interface Props {
    
}

const MainLanding: React.FC<Props> = () => {
    return (
        <div className="md:col-span-3 lg:col-span-1  flex flex-col  mt-24 gap-y-4 justify-center text-center">
        <h1 className="text-3xl 2xl:text-4xl text-white shadow-xl shadow-slate-800 bg-transparent">
          MINOAN EXCHANGE
        </h1>
        <h3 className="text-2xl 2xl:text-3xl">
          A Perpetual stock exchange
        </h3>
       

        <div className="flex flex-wrap justify-evenly md:gap-x-2 gap-y-3  2xl:mx-12 2xl:text-xl 2xl:my-8  2xl:gap-y-4">
        
            <ScrollUp className='p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125' href={'#trade-page'}>
            How to trade
            </ScrollUp>
            <ScrollUp className='p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125' href={'#loan-pool'}>Loan Pools</ScrollUp>
            <a className='p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125' href={'/theseusDao'}>Join the Thesus DOA</a>
          <ScrollUp className='p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125' href={'#theseus-dao'}>Thesus DOA</ScrollUp>
          <a className='p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125' href={'/pools'}>Ariadne Pools</a>
          <ScrollUp className='p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125' href={'#white-paper'}>White Paper</ScrollUp>
          <a className='p-2 bg-slate-800 rounded-3xl font-bold hover:scale-125' href={'/docs'}>Docs</a>
        </div>
      </div>
    )
}

export default MainLanding
