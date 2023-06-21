import React from 'react'

interface Props {

}

const loading: React.FC<Props> = () => {
    return (
        <div className="m-6 ">
            <div className="flex flex-row justify-between animate-pulse">
                <div className="mt-12 ml-24 text-white  ">
                    <h1 className="h-10 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5 "></h1>

                    <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 3xl:grid-cols-7   mt-12 gap-y-6 gap-x-6 text-white">
                        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
                            <h1 className=" h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-[85%] "></h1>
                            <h3 className='text-xs md:text-lg'> Your Balance</h3>
                        </div>
                        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
                            <h1 className=" h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-[85%] "></h1>
                            <h3 className='text-xs md:text-lg'> Current Value</h3>
                        </div>
                        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
                            <h1 className=" h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-[85%] "></h1>
                            <h3 className='text-xs md:text-lg'> Total Supply</h3>
                        </div>
                        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
                            <h1 className=" h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-[85%] "></h1>
                            <h3 className='text-xs md:text-lg'> Total Value</h3>
                        </div>
                        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
                            <h1 className=" h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-[85%] "></h1>
                            <h3 className='text-xs md:text-lg'>Total Loaned Out</h3>
                        </div>
                        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
                            <h1 className=" h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-[85%] "></h1>
                            <h3 className='text-xs md:text-lg'>Total In Vault</h3>
                        </div>
                        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
                            <h1 className=" h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-[85%] "></h1>
                            <h3 className='text-xs md:text-lg'>Insurance Fund</h3>
                        </div>
                        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
                            <h1 className=" h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-[85%] "></h1>
                            <h3 className='text-xs md:text-lg'>Total Trades</h3>
                        </div>
                        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
                            <h1 className=" h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-[85%] "></h1>
                            <h3 className='text-xs md:text-lg'>Current Trades</h3>
                        </div>
                        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
                            <h1 className=" h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-[85%] "></h1>
                            <h3 className='text-xs md:text-lg'>Total Invested</h3>
                        </div>
                        <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
                            <h1 className=" h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-[85%] "></h1>
                            <h3 className='text-xs md:text-lg'>Currently Invested</h3>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <svg className="h-full w-1/3 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                </div>
            </div>
            <div className="flex flex-row justify-center mx-2 my-8  md:m-8 border-4 border-amber-400 mt-32">

                <svg className="h-64 w-3/4 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
            </div>
            <div
              id={"stats"}
              className="col-span-9 lg:col-span-9 flex flex-wrap justify-evenly items-center text-center gap-y-12">
              <div className="outside-box">
        <div className="inside-box">
          <div className="flex flex-col gap-y-4 animate-pulse ">
            <h1 className='text-white text-center text-opacity-0 opacity-0'>Investor Stats</h1>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg  w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
            <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
            </div>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Max Leverage:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>15X</h3>
            </div>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
            </div>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Maximum Investment:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
            </div>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Interest Rate:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
            </div>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Interest Payment Period:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>hrs</h3>
            </div>
          </div>
        </div>
        </div>
        <div className="outside-box">
        <div className="inside-box">
          <div className="flex flex-col gap-y-4 animate-pulse ">
            <h1 className='text-white text-opacity-0 opacity-0'>Staking Information</h1>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg  w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
            <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
            </div>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Max Leverage:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>15X</h3>
            </div>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
            </div>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Maximum Investment:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
            </div>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Interest Rate:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
            </div>
            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-200 rounded-t-lg dark:bg-gray-700'>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Interest Payment Period:</h3>
              <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>hrs</h3>
            </div>
          </div>
        </div>
        </div>
            </div>
        </div>
    )
}

export default loading
