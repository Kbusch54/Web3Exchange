"use client";
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { getAllFunctions, getFunctionCallData } from '../../utils/contractReads/loanpool/functionReading';
import { getAllUpdateFunctions } from '../../utils/contractReads/ariadneDao/internalFunctions';
import { Address } from 'wagmi';
import AriadnePurposeButton from '../forms/buttons/AriadnePurposeButton';


const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    backgroundColor: 'transparent',
    border: 'none',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
  },
  AnimationEffect: {
    enter: 'ease-out',
    exit: 'ease-in',
  },

};
interface Props {
  ammAddress: Address;
  currentValues: {
    interestPeriods: number,
    loanInterestRate: number,
    mmr: number,
    minHoldingsReqPercentage: number,
    tradingFee: number,
    minLoan: number,
    maxLoan: number,
  }
}

export default function PurposalModal() {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(false);
  const [key, setKey] = React.useState(0);
  const [check, setCheck] = React.useState(false);
  const [rawValue, setRawValue] = React.useState<number>(0); //decimals to send to contract
  const [isError, setIsError] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [callData, setCallData] = useState<string| null>(null);

  const user:Address ='0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42';
  const currentValues = {
    interestPeriods: 3600,
    loanInterestRate: 10000,
    mmr: 100000,
    maxLoan: 5000000000,
    minHoldingsReqPercentage: 20,
    minLoan: 100000000,
    tradingFee: 100000,
  };
  const address = '0xd4e3f66e134558df57cd7ce2e17758bf9e041851';
  const convertCamelCaseToTitle = (camelCaseString:string) => {
    // Replace uppercase letters with a space followed by the uppercase letter
    const spacedString = camelCaseString.replace(/([A-Z])/g, ' $1');
    // Convert the string to uppercase
    const allCapsString = spacedString.toUpperCase();
    // Remove leading space if present
    const trimmedString = allCapsString.trim();
    // Return the final converted string
    return trimmedString;
  };
  const updateFunciton = getAllUpdateFunctions();
  console.log('updateFunciton', updateFunciton);

  const calculationVariables = [
    { interestPeriods: [3600, 'hrs'] },
    { loanInterestRate: [10 ** 4, '%'] },
    { mmr: [10 ** 4, '%'] },
    { maxLoan: [10 ** 6, 'USDC'] },
    { minHoldingsReqPercentage: [1, '%'] },
    { minLoan: [10 ** 6, 'USDC'] },
    { tradingFee: [10 ** 5, '%'] },
  ];
  const theseusMinMax = {
    minmmr: 10000,
    maxmmr: 2000000,
    minloanInterestRate: 5000,
    maxloanInterestRate: 90000,
    mintradingFee: 30000,
    maxtradingFee: 900000,
    minLoan: 20000000,
    maxLoan: 10000000000,
    minHoldingsReqPercentage: 10,
    maxHoldingsReqPercentage: 40,
    mininterestPeriods: 1800,
    maxinterestPeriods: 7200
  }

  const findMinAndMax = (key: string) => {
    if (key.includes('min') || key.includes('max')) key = key.slice(3)
    //@ts-ignore
    const min = theseusMinMax[`min${key}`];
    //@ts-ignore
    const max = theseusMinMax[`max${key}`];
    return [min, max];
  }


  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //   subtitle.style.color = '#f00';
  }

  function closeModal() {
    setSelected(false);
    setKey(0);
    setIsOpen(false);
  }

  const ariadneFunctions = getAllFunctions();
  const keys = ariadneFunctions.map((item) => item.inputs[0].name.slice(1));

  const functionNames = ariadneFunctions.map((item) => item.name);

  const calculateValue = (value: number) => {
    //@ts-ignore
    const arr = calculationVariables[key][keys[key]];
    //@ts-ignore
    const divisible = arr[0];
    //@ts-ignore
    const unit = arr[1];
    return value / divisible + " " + unit;
  }
  const inverseCalculateValue = (value: number) => {
    //@ts-ignore
    const arr = calculationVariables[key][keys[key]];
    //@ts-ignore
    const muliti = arr[0];
    return value * muliti;
  }
  const handleValidation = () => {
    if(inputRef.current) {
      const value = Math.floor(inverseCalculateValue(parseFloat(inputRef.current.value)));
      const min = findMinAndMax(keys[key])[0];
      const max = findMinAndMax(keys[key])[1];
      if(value > max) {
        setCheck(false);
        setErrorMessage('Value is too high');
        setIsError(true);
        setCallData(null);
      } else if (value < min) {
        setCheck(false);
        setIsError(true);
        setErrorMessage('Value is too low');
        setCallData(null);
      }else if (value >= min && value <= max) {
        setCheck(true);
        setErrorMessage('');
        setIsError(false);
        //@ts-ignore
          const _callData = getFunctionCallData(functionNames[key], [value, address]);
          setCallData(_callData);
      } else {
        setCheck(false);
        setErrorMessage('Error');
        setIsError(true);
        setCallData(null);
      }
    }

  }

  //@ts-ignore
  const handleButton = (index) => {
    const value = ariadneFunctions[index]
    if (value.name) {
      calculateValue(2)
      setKey(index);
      setSelected(true);
    }
  }
  return (
    <div>
      <button className='py-4 my-6 text-xl px-8 md:px-32 md:py-12 rounded-full md:my-12  bg-amber-400 hover:shadow-2xl hover:shadow-amber-200 text-white md:text-5xl text-center hover:scale-125' onClick={openModal}>Purpose</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Add Collateral Modal"
      >

        <div className='flex flex-row modal-background opacity-90 relative '>
          {!selected && <button onClick={closeModal} className='text-lg text-white bg-red-500 rounded-full py-[.07rem] px-[.375rem] absolute top-5 right-4'>X</button>}
          {selected && <button onClick={() => setSelected(false)} className='absolute top-5 left-4 text-lg text-white bg-amber-500 rounded-full py-[.07rem] px-[.375rem]'>{'<'}</button>}
          <div className={`${selected ? 'hidden' : 'flex'}`}>
            <div className="flex flex-col \  gap-y-2 m-8 mt-12">
              <h1 className='text-teal-200'>Loan Pool updates</h1>
              {ariadneFunctions.map((item, i) => {
                return (
                  <button key={item.name} onClick={() => handleButton(i)} className='px-2 py-1 text-white bg-amber-400 hover:scale-125 rounded-2xl'>{item.name?.slice(3)}</button>


                );
              })
              }
            </div>
            <div className='flex flex-col gap-y-2 m-8 mt-12'>
              <h1 className='text-teal-200'>Internal DAO Updates</h1>
              {updateFunciton.map((item, i) => {
                return (
                  <button key={item.name} className='px-2 py-1 text-white bg-blue-800 hover:scale-125 rounded-2xl'>{item.name?.slice(6)}</button>

                )
              })}
            </div>
          </div>
          <div className={`${selected ? 'flex' : 'hidden'}`}>
            <div className='relative flex flex-col p-12'>
              <button onClick={closeModal} className='text-lg text-white bg-red-500 rounded-full py-[.07rem] px-[.375rem] absolute top-5 right-4'>X</button>
              <button onClick={() => setSelected(false)} className='absolute top-5 left-4 text-lg text-white bg-amber-500 rounded-full py-[.07rem] px-[.375rem]'>{'<'}</button>
              <h1 className='mt-12 mb-4 text-center text-white'>{convertCamelCaseToTitle(keys[key])}</h1>
              {isError && <p className='text-red-500 text-center text-xl mb-2 animate-pulse'>{errorMessage}</p>}
              <div className='flex flex-col  text-center  gap-x-4 border-2 border-white bg-sky-500 text-white w-full'>
                <div className='flex flex-row justify-between m-2 '>
                  <p className='text-md lg:text-xl pr-8'>Current Value</p>
                  <div className='flex-col'>
                    {/* @ts-ignore */}
                    <p className='text-sm  md:text-md lg:text-lg text-sky-100 px-4'>{calculateValue(currentValues[keys[key]])}</p>

                    <hr />
                  </div>
                </div>
                <div className='flex flex-row justify-between m-2'>
                  <p className='text-md lg:text-xl pr-8'>Max Allowed</p>
                  <div className='flex-col'>
                    <p className='text-sm  md:text-md lg:text-lg text-sky-100 px-4'>{calculateValue(findMinAndMax(keys[key])[1])}</p>
                    <hr />
                  </div>
                </div>
                <div className='flex flex-row justify-between m-2'>
                  <p className='text-md lg:text-xl pr-8'>Min Allowed</p>
                  <div className='flex-col'>
                    <p className='text-sm  md:text-md lg:text-lg text-sky-100 px-4'>{calculateValue(findMinAndMax(keys[key])[0])}</p>
                    <hr />
                  </div>
                </div>
                <div className='flex flex-col justify-between m-2'>
                  <input className=' rounded-3xl text-sky-200 text-md lg:text-lg bg-sky-700 text-center ' type='number' ref={inputRef} onInput={handleValidation} />
                  {/* @ts-ignore */}
                  <p className='text-xs lg:text-md '>Proposed Value {calculationVariables[key][keys[key]][1]}</p>
                </div>
              </div>
              <div className='flex flex-col  text-center justify-between gap-x-4 border-2 border-white bg-sky-500 px-4 my-6 py-4'>
                <div className='flex flex-row justify-evenly text-white mb-2'>
                  <p className='text-xs md:text-lg lg:text:2xl mr-7'>% of Votes Needed </p>
                  <div className='flex-col'>
                    <p className='text-sm md:text-md lg:text-lg  text-sky-100'>74%</p>
                    <hr />
                  </div>
                </div>
                <div className='flex flex-row justify-around '>
                  <div className='flex flex-col text-xs'>
                    <p className='text-gray-800 text-sm lg:text-md'>Your Holdings %</p>
                    <p className=' md:text-md lg:text-xl text-sky-100'>12%</p>
                  </div>
                  <div className='flex flex-col text-xs'>
                    <p className='text-gray-800 text-sm lg:text-md'>Expiration Time</p>
                    <p className=' md:text-md lg:text-xl text-sky-100'>4hrs 20min</p>
                  </div>
                </div>
              </div>
            <div className='flex flex-row justify-between'>
              <button className='px-2 py-1 bg-red-500 rounded-2xl text-white text-lg hover:scale-125' onClick={closeModal}>Cancel</button>
              {callData && !isError ?(

                <AriadnePurposeButton user={user} ammId='tesla' disabled={false} callData={callData}/>
              ):(
                <button disabled className='px-2 py-1 bg-teal-500 rounded-2xl text-white text-lg hover:scale-125'>Loading...</button>
              )}
            </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
