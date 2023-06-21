import * as React from 'react';

import ExSkeleton from '../../../components/skeletons/ExSkeleton';
import Image from 'next/image';
import stone from "../../../public/assets/minotaur-logo-thing.png";

interface Props {

}

const loading: React.FC<Props> = () => {
    return (
        <div className="lg:grid lg:grid-cols-12 m-4 relative">
            <div className="lg:col-span-2 ">
                <div className="flex flex-col text-center justify-center">
                    <button className="text-3xl bg-slate-800/80 border border-slate-800/30 text-white h-10  rounded-xl hover:bg-blue-700 ">

                    </button>

                    <div className="flex justify-center">
                        <div className="flex items-center justify-center h-64 w-[80%] mb-4 bg-gray-300 rounded dark:bg-gray-700">
                            <svg className="w-64 h-64 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                        </div>
                    </div>
                    <div className="text-3xl text-white">...</div>
                    <div className="hidden 2xl:inline m-4">
                        <div className="outside-box">
                            <div className="inside-box">
                                <div className="flex flex-col gap-y-4 animate-pulse ">
                                    <h1 className='text-white text-center bg-gray-700 rounded-3xl w-full h-12'></h1>
                                    <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg  w-full h-12 bg-gray-400 rounded-full dark:bg-gray-700'>
                                        <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                                        <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                                    </div>
                                    <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-full dark:bg-gray-700'>
                                        <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Max Leverage:</h3>
                                        <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>15X</h3>
                                    </div>
                                    <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-full dark:bg-gray-700'>
                                        <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                                        <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                                    </div>
                                    <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-full dark:bg-gray-700'>
                                        <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Maximum Investment:</h3>
                                        <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" mr-8 lg:col-span-7  ">
                <div className="grid grid-rows-6 ">
                    <div className="row-span-4 hidden md:inline-block overflow-clip relative">
                    <div className=' opacity-30 top-1/2 right-[42%]  absolute'>
                <Image src={stone} alt={'minotaur'} height={300} width={300} className='animate-spin' />
            </div>
                        <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                            <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                        </div>
                    </div>
                    <div className="row-span-4 inline-flex md:hidden overflow-clip">
                        <div className="flex items-center justify-center h-48  w-full mb-4 bg-gray-300 rounded dark:bg-gray-700">
                            <svg className="w-24 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                        </div>
                    </div>
                    <div className="row-span-2">
                        <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                            <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-3 gap-y-4">
                <div className="outside-box">
                    <div className="inside-box">
                        <div className="flex flex-col gap-y-4 animate-pulse ">
                            <h1 className='text-white text-center bg-gray-700 rounded-3xl w-full h-12'></h1>
                            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg  w-full h-16 bg-gray-400 rounded-full dark:bg-gray-700'>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                            </div>
                            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-16 bg-gray-400 rounded-full dark:bg-gray-700'>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Max Leverage:</h3>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>15X</h3>
                            </div>
                            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-6 bg-gray-400 rounded-full dark:bg-gray-700'>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                            </div>
                            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-6 bg-gray-400 rounded-full dark:bg-gray-700'>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                            </div>
                            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-6 bg-gray-400 rounded-full dark:bg-gray-700'>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                            </div>
                            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-6 bg-gray-400 rounded-full dark:bg-gray-700'>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                            </div>
                            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-full dark:bg-gray-700'>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Maximum Investment:</h3>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="outside-box my-6">
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
                            <div className='flex flex-row  px-0 gap-x-8  py-4 md:px-4 md:py-2 lg:px-2 lg:py-1 lg:gap-x-24 xl:px-2 xl:py-1 xl:gap-x-6 2xl:px-2 2xl:py-1 2xl:gap-x-24 text-sm md:text-lg text-center justify-between text-white xl:text-md 2xl:text-lg w-full h-12 bg-gray-400 rounded-full dark:bg-gray-700'>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'>Minimum Investment:</h3>
                                <h3 className='text-xl lg:text-2xl text-opacity-0 opacity-0'></h3>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-12 grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-3 gap-x-6 items-center justify-evenly gap-y-8  mt-8">

                <div className="inline 2xl:hidden ">
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
            <div className='flex flex-col justify-center items-center lg:col-span-12 mt-20'>

                <div className='bg-gray-500 w-full h-24 animate-pulse rounded-3xl'></div>
                <div className='bg-gray-800 w-1/3 h-12 animate-pulse rounded-3xl mt-12 '></div>
                <div className='bg-gray-500 w-full h-24 animate-pulse rounded-3xl mt-12'></div>
            </div>      
        </div >
    )
}

export default loading
