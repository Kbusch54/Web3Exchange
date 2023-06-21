
import React from 'react'

interface Props {

}

const loading: React.FC<Props> = () => {
    return (
        <div className='mx-4 flex flex-col gap-y-4 animate-pulse '>
            <h1 className='text-white'>Dashboard</h1>
            <section className="lg:mt-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7   mt-12 gap-y-6 gap-x-6 text-opacity-0 text-gray-300">
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1 className='text-opacity-0 opacity-0 bg-gray-400 animate-pulse rounded-xl '>$0</h1>
                    <h3>USDC</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1 className='text-opacity-0 opacity-0 bg-gray-400 animate-pulse rounded-xl '>0</h1>
                    <h3># Investments Made</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1 className='text-opacity-0 opacity-0 bg-gray-400 animate-pulse rounded-xl '>$0.00</h1>
                    <h3>USDC Currently Invested</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1 className='text-opacity-0 opacity-0 bg-gray-400 animate-pulse rounded-xl '>0</h1>
                    <h3># Active Trades</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1 className='text-opacity-0 opacity-0 bg-gray-400 animate-pulse rounded-xl '>$0.00</h1>
                    <h3>USDC Currently Invested</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1 className='text-opacity-0 opacity-0 bg-gray-400 animate-pulse rounded-xl '>$0.00</h1>
                    <h3>Collateral</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1 className='text-opacity-0 opacity-0 bg-gray-400 animate-pulse rounded-xl '>$12.05</h1>
                    <h3>Current PNL</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1 className='text-opacity-0 opacity-0 bg-gray-400 animate-pulse rounded-xl '>$0.00</h1>
                    <h3>USDC Staked Value</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1 className='text-opacity-0 opacity-0 bg-gray-400 animate-pulse rounded-xl '>$0.00</h1>
                    <h3>USDC Staked</h3>
                </div>
                <div className='flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40'>
                    <h1 className='text-opacity-0 opacity-0 bg-gray-400 animate-pulse rounded-xl '>$0.00</h1>
                    <h3>Staked PNL</h3>
                </div>
            </section>
            <div className='grid grid-cols-12'>
                <div className='col-span-12 mx-0 md:mx-12 lg:col-span-6 2xl:col-span-4 3xl-col-span-3 px-8'>
                    <div className='h-16 w-1/2 rounded-tr-2xl bg-slate-800  border-b border-blue-300 relative'>
                        <div className='flex flex-row justify-between mx-6 lg:mx-0 3xl:mx-4'>

                            <p className='text-white text-3xl pt-4'></p>

                            <button className={`text-3xl text-white`}>
                                {'' > ''}
                            </button>
                        </div>
                    </div>
                    <div className='text-white text-3xl w-1/2 bg-[rgba(24,24,35,255)]'></div>

                    <div className='bg-slate-800 flex flex-col flex-wrap rounded-2xl rounded-tl-none justify-center text-center items-center'>
                        <div className='bg-gray-400 rounded-full h-64 w-64 4xl:h-96 4xl:w-96 m-12 '></div>
                    </div>
                </div>

                <div className='col-span-12 lg:col-span-6 2xl:col-span-8 3xl:col-span-4 grid grid-cols-6 gap-x-4'>
                    <div className='col-span-6 2xl:col-span-2 self-center mx-16 mt-4 md:mx-40 md:mt-6 2xl:mx-0 2xl:mt-0 2xl:pr-4 '>
                        <div className='flex flex-row justify-between bg-slate-800 rounded-2xl px-4 my-4 relative'>
                            <p className='text-white text-3xl text-center p-4'>...</p>
                            <button className={`text-3xl text-white `} >{'' > ''}</button>

                        </div>

                        <div className=' flex flex-col flex-wrap bg-slate-800 rounded-2xl '>
                            <div className='flex flex-row justify-between align-middle place-items-center px-2 mt-8 text-white text-2xl text-center'>
                                <p className='mt-6 w-12 bg-gray-700 rounded-2xl animate-pulse'>.......</p>
                                <p className='text-amber-400 text-lg'>...</p>
                            </div>

                            <div className="flex items-baseline mt-4 space-x-2 justify-between mx-2">
                                <div className="w-[0.25rem] ml-1 bg-gray-200 rounded-t-lg h-32 mb-1 dark:bg-gray-700"></div>
                                <div className="w-[0.25rem]  h-56 bg-gray-200 rounded-t-lg mb-1 dark:bg-gray-700"></div>
                                <div className="w-[0.25rem]  bg-gray-200 rounded-t-lg h-32 mb-1 dark:bg-gray-700"></div>
                                <div className="w-[0.25rem]  h-64 bg-gray-200 rounded-t-lg mb-1 dark:bg-gray-700"></div>
                                <div className="w-[0.25rem]  bg-gray-200 rounded-t-lg h-40 mb-1 dark:bg-gray-700"></div>
                                <div className="w-[0.25rem]  bg-gray-200 rounded-t-lg h-32 mb-1 dark:bg-gray-700"></div>
                                <div className="w-[0.25rem] mr-1 bg-gray-200 rounded-t-lg h-40 mb-1 dark:bg-gray-700"></div>
                            </div>

                        </div>
                    </div>
                    <div className='col-span-6 2xl:col-span-4 mt-24 border border-slate-800 flex flex-col h-fit rounded-xl'>
                        <p className='text-white h-12 text-xl text-center pt-4 bg-gray-700 w-full rounded-full animate-pulse'></p>
                        <div className="flex items-center justify-center h-64 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                            <svg className="w-40 h-40 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                        </div>
                    </div>
                </div>
                <div className='col-span-12 3xl:col-span-4 mx-12 flex flex-col 2xl:flex-row 2xl:justify-between 3xl:flex-col animate-pulse '>
                    <div className='mt-0 2xl:mt-8 3xl:mt-0'>
                        <div className='bg-transparent flex flex-row mx-[1.53rem]'>
                            <p className=' w-1/2 rounded-t-2xl bg-gray-600 text-white text-3xl text-center pt-4 border border-b-0 border-gray-600'></p>
                            <div className='w-[49.3%]  bg-gray-600 border-b border-gray-600 '></div>
                        </div>
                        <div className='mx-6 mb-6 bg-gray-700 border-2 border-gray-600 border-t-0 text-white flex flex-col justify-center text-center gap-y-6 py-12 rounded-2xl rounded-tl-none'>

                            <div className='border  p-2 mx-2 rounded-full '>
                                <h3 className='text-amber-400 text-xs lg:text-xl h-12 bg-gray-200 rounded-full'></h3>
                            </div>
                            <div className='grid grid-cols-4 mx-4'>
                                <div className='col-span-3 flex flex-row justify-around'>

                                    <div className='flex flex-col '>
                                        <div className='border-2  rounded-3xl w-24 h-10 bg-gray-300'>
                                            <p className=' text-lg'></p>
                                        </div>
                                        <p className='text-sm text-gray-600'>....</p>
                                    </div>
                                    <div className='flex flex-col '>
                                        <div className='border-2rounded-3xl'>
                                            <p className=' text-lg w-24 h-10 bg-gray-300 rounded-full'></p>
                                        </div>
                                        <p className='text-sm text-gray-600'>...</p>
                                    </div>
                                </div>
                                <div className='col-span-1'>
                                    <div className='flex flex-col '>
                                        <p className='w-24 h-10 bg-gray-300 rounded-full '></p>
                                        <p className='text-sm text-gray-600 '>....</p>
                                    </div>
                                </div>
                                <div className='col-span-8 flex flex-row relative'>
                                    <div className='flex flex-col mt-4'>
                                        <p className='text-lg w-24 h-10 bg-gray-300 rounded-full'></p>
                                        <div className='p-2'>
                                            <p className='text-3xl text-amber-400 w-24 h-10 bg-gray-300 rounded-full'></p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <div className='bg-transparent flex flex-row 2xl:px-64 3xl:px-0 2xl:mr-40 3xl:mr-0'>
                            <p className=' w-1/2 rounded-t-2xl opacity-80 text-white text-3xl text-center pt-4 border border-b-0 border-gray-600 inline 2xl:hidden 3xl:inline bg-gray-400  '>
                            </p>
                            <div className='w-[49%] text-white text-3xl  bg-[rgba(24,24,35,255)]   border-b border-gray-600 '></div>
                        </div>
                        <div className='hidden 2xl:block 2xl:mt-12 rounded-t-2xl 3xl:mt-0 mt-0 3xl:hidden bg-gray-500 opacity-80 text-white text-3xl text-center pt-4 border border-b-0 border-gray-600 w-3/4'>
                            <p className='bg-gray-400 w-12 h-10 animate-pulse rounded-2xl'></p>
                        </div>
                        <div className='bg-slate-800 opacity-80 flex flex-col flex-wrap rounded-2xl rounded-tl-none border border-t-0 border-gray-600'>
                            <div className='flex flex-row text-white mx-4 items-center justify-between border border-gray-500 my-1 bg-slate-700 mt-6'>
                                <div className='flex flex-row gap-x-4 items-center'>
                                    <div className=' text-[2.5rem] font-extrabold text-gray-300 mb-1'>|</div>
                                    <div className='flex flex-col text-left '>
                                        <p className='text-xl bg-gray-400 w-48 mt-2 rounded-3xl h-10 animate-pulse '> </p>
                                        <p className='text-sm'>...</p>
                                    </div>
                                </div>
                                <div className='col-span-2 text-3xl text-right'>#</div>
                            </div>
                            <div className='flex flex-row text-white mx-4 items-center justify-between border border-gray-500 my-1 bg-slate-700'>
                                <div className='flex flex-row gap-x-4 items-center'>
                                    <div className=' text-[2.5rem] font-extrabold text-gray-300 mb-1'>|</div>
                                    <div className='flex flex-col text-left '>
                                        <p className='text-xl bg-gray-400 w-48 mt-2 rounded-3xl h-10 animate-pulse '></p>
                                        <p className='text-sm'>...</p>
                                    </div>
                                </div>
                                <div className='col-span-2 text-3xl text-right'>#</div>
                            </div>
                            <div className='flex flex-row text-white mx-4 items-center justify-between border border-gray-500 my-1 bg-slate-700'>
                                <div className='flex flex-row gap-x-4 items-center'>
                                    <div className=' text-[2.5rem] font-extrabold text-gray-300 mb-1'>|</div>
                                    <div className='flex flex-col text-left '>
                                        <p className='text-xl bg-gray-400 w-48 mt-2 rounded-3xl h-10 animate-pulse '></p>
                                        <p className='text-sm'>...</p>
                                    </div>
                                </div>
                                <div className='col-span-2 text-3xl text-right'>#</div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className='flex flex-row gap-x-4 mt-12'>
                    <div className='bg-gray-400 w-24 h-8 animate-pulse rounded-3xl'></div>
                    <div className='bg-gray-400 w-24 h-8 animate-pulse rounded-3xl'></div>
                </div>
            </div>
                <div className='bg-gray-500 w-full h-24 animate-pulse rounded-3xl'></div>
                <div className='bg-gray-500 w-full h-96 animate-pulse rounded-3xl mt-12'></div>

        </div>
    )
}

export default loading
