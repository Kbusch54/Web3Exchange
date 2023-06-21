import React from 'react'

interface Props {

}

const loading: React.FC<Props> = () => {
  return (
    <div>
      <div className="text-center">
        <div className="grid m-12 text-white text-5xl grid-cols-3 lg:grid-cols-9 gap-y-12 ">
          <div className="col-span-3 md:col-span-2">
            <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
              <svg className="w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-y-24 text-center">
            <h1 className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></h1>
            <h3 className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></h3>
          </div>

          <section
            id={"balances"}
            className="col-span-6 md:col-span-4 lg:col-span-6 lg:mt-0 grid grid-cols-2 xl:grid-cols-3 mt-12 gap-y-12 text-white animate-pulse"
          >
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
              <h1 className=' h-8 bg-gray-600 rounded-full dark:bg-gray-700 m-4'>...</h1>
              <h3 className='text-xs md:text-lg'> Your Token Balance</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
              <h1 className=' h-8 bg-gray-600 rounded-full dark:bg-gray-700 m-4'>...</h1>
              <h3 className='text-xs md:text-lg'> Current Token Value</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
              <h1 className='  h-8 bg-gray-600 rounded-full dark:bg-gray-700 m-4'>...</h1>
              <h3 className='text-xs md:text-lg'> Total Supply</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
              <h1 className='  h-8 bg-gray-600 rounded-full dark:bg-gray-700 m-4'>...</h1>
              <h3 className='text-xs md:text-lg'> Available USDC Supply</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
              <h1 className='  h-8 bg-gray-600 rounded-full dark:bg-gray-700 m-4'>...</h1>
              <h3 className='text-xs md:text-lg'> Loaned Out</h3>
            </div>
            <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
              <h1 className=' h-8 bg-gray-600 rounded-full dark:bg-gray-700 m-4'>...</h1>
              <h3 className='text-xs md:text-lg'>Total USDC Supply</h3>
            </div>
          </section>
          <div
            id={"charts"}
            className="hidden md:block col-span-9 px-4  text-lg shadow-xl shadow-slate-500"
          >

            <div className="flex items-center justify-center h-96 mb-4 bg-gray-300 rounded dark:bg-gray-700">
              <svg className="w-40 h-40 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>

            </div>

          </div>
          <section id={"select-charts"} className="col-span-9">
            <div className='flex flex-col justify-center self-center'>
              <div className='h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4'>

              </div>
              <div className="grid grid-cols-7 lg:grid-cols-12 gap-x-8  items-center">
                <div className='col-span-7 flex-col flex items-center align-middle'>
                  <div className="flex items-center justify-center h-48 bg-gray-400 rounded sm:w-96 w-[500rem] dark:bg-gray-700">
                      <svg className="h-40 w-40 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>

                  </div>
                  <div className='flex flex-row justify-around pt-10 animate-pulse mx-12 md:mx-0'>
                    <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-900 m-4 bg-opacity-40 p-4'>
                      <h1 className=' h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-24 md:w-32 lg:w-24 2xl:w-48'></h1>
                      <h3 className='text-xs md:text-lg'>...</h3>
                    </div>
                    <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-800 m-4 bg-opacity-40 p-4'>
                      <h1 className=' h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-24 md:w-32 lg:w-24 2xl:w-48'></h1>
                      <h3 className='text-xs md:text-lg'>...</h3>
                    </div>
                    <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-lg bg-sky-800 m-4 bg-opacity-40 p-4'>
                      <h1 className=' h-8 bg-gray-200 rounded-full dark:bg-gray-700 m-4 w-24 md:w-32 lg:w-24 2xl:w-48'></h1>
                      <h3 className='text-xs md:text-lg'>...</h3>
                    </div>
                  </div>
                </div>
                <div className='col-span-7 lg:col-span-5 items-center '>
                  <div className='h-16 w-1/2 rounded-tr-2xl bg-slate-800  border-b border-blue-900'>
                    <p className='text-white text-3xl text-center mt-4 bg-gray-500 rounded-3xl h-10 w-full align-middle'></p>
                  </div>
                  <div className='text-white text-3xl w-1/2 bg-[rgba(24,24,35,255)]'></div>
                  <div className='bg-slate-800 flex flex-col flex-wrap rounded-2xl rounded-tl-none justify-center text-center items-center'>
                    <div className='bg-gray-400 rounded-full h-64 w-64 4xl:h-96 4xl:w-96 m-12 '></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div
            id={"stats"}
            className="col-span-9 lg:col-span-9 flex flex-wrap justify-evenly items-center text-center gap-y-12">
            <div className="outside-box">
              <div className="inside-box">
                <div className="flex flex-col gap-y-4 animate-pulse ">
                  <h1 className='text-white text-center bg-gray-700 rounded-3xl w-full h-12'></h1>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg  w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Max Leverage:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>15X</h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Maximum Investment:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Interest Rate:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Interest Payment Period:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>hrs</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="outside-box">
              <div className="inside-box">
                <div className="flex flex-col gap-y-4 animate-pulse ">
                <h1 className='text-white text-center bg-gray-700 rounded-3xl w-full h-12'></h1>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg  w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Max Leverage:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>15X</h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Maximum Investment:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Interest Rate:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Interest Payment Period:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>hrs</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='m-24'>

        
          <h1 className='w-full bg-gray-700 h-10 rounded-full mb-12'></h1>
          <div className="outside-box">
              <div className="inside-box">
                <div className="flex flex-col gap-y-4 animate-pulse ">
                <h1 className='text-white text-center bg-gray-700 rounded-3xl w-full h-12'></h1>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg  w-full h-12 bg-gray-600 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-600 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Max Leverage:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>15X</h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-600 rounded-t-lg dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                  </div>
                  <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-600 rounded-full dark:bg-gray-700'>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Maximum Investment:</h3>
                    <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                  </div>
              
                </div>
              </div>
            </div>
            </div>
      </div>
    </div>
  )
}

export default loading
