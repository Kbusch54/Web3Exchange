import React from 'react'

interface Props {
    
}

const Balances: React.FC<Props> = () => {
    return (
        <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 3xl:grid-cols-7   mt-12 gap-y-6 gap-x-6 text-white">
        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
          <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">0.00</h1>
         <h3 className='text-xs md:text-lg'> Your Balance</h3>
        </div>
        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
          <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">$0.00</h1>
         <h3 className='text-xs md:text-lg'> Current Value</h3>
        </div>
        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
          <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">134533</h1>
         <h3 className='text-xs md:text-lg'> Total Supply</h3>
        </div>
        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
          <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">$9382.02</h1>
         <h3 className='text-xs md:text-lg'> Total Value</h3>
        </div>
        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
          <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">$6983.39</h1>
         <h3 className='text-xs md:text-lg'>Total Loaned Out</h3>
        </div>
        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
          <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">$2398.63</h1>
         <h3 className='text-xs md:text-lg'>Total In Vault</h3>
        </div>
        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
          <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">$2398.63</h1>
         <h3 className='text-xs md:text-lg'>Insurance Fund</h3>
        </div>
      </div>
    )
}

export default Balances
