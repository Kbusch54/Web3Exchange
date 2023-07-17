"use client";
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { getAllFunctions, getFunctionCallDataLoanPool } from '../../../utils/contractReads/loanpool/functionReading';
import { getAllUpdateFunctions, getFunctionCallDataAriadne } from '../../../utils/contractReads/ariadneDao/internalFunctions';
import { Address } from 'wagmi';
import { useGetCurrentId } from '../../../utils/contractReads/ariadneDao/currentId';
import DAODetails from '../interior/DAODetails';
import { convertCamelCaseToTitle } from '../../../utils/helpers/functions';
import { loanpool } from '../../../utils/address';
import ProposeButton from '../../forms/buttons/proposals/ProposeButton';




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
  symbol:string
  currentValue: {
    interestPeriod: number,
    interestRate: number,
    mmr: number,
    minHoldingsReqPercentage: number,
    tradingFee: number,
    minLoan: number,
    maxLoan: number,
  }
  loanPoolTheseus: {
    minMMR:number,
    maxMMR:number,
    minInterestRate:number,
    maxInterestRate:number,
    minTradingFee:number,
    maxInterestPeriod:number,
    minInterestPeriod:number,
    minHoldingsReqPercentage:number,
    maxHoldingsReqPercentage:number,
    maxTradingFee:number,
    minLoan:number,
    maxLoan:number,
  }
  ariadneData: {
    id: Address,
    votesNeededPercentage: number,
    votingTime: number,
    poolToken: { 
      totalSupply: number,
       tokenBalance:[ {
        tokensOwnedbByUser:number;
      }
      ]
      }
  }
  user:Address
}

export default function ProposalModal({currentValue,ammAddress,user,symbol,loanPoolTheseus,ariadneData}: Props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [key, setKey] = useState(0);
  const [check, setCheck] = useState(false);
  const [interiorSelect, setInteriorSelect] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [isError, setIsError] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [callData, setCallData] = useState<string | null>(null);
  const [interior, setInterior] = useState<string>('updateMaxVotingPower');
  const [addressTo, setAddressTo] = useState<Address|null>(null);
  


  const { currentId } = useGetCurrentId(symbol);

  // useEffect(() => {
 
  // }, [currentId]);
  const currentValues = {
    interestPeriods: currentValue.interestPeriod,
    loanInterestRate: currentValue.interestRate,
    mmr: currentValue.mmr,
    maxLoan: currentValue.maxLoan,
    minHoldingsReqPercentage: currentValue.minHoldingsReqPercentage,
    minLoan: currentValue.minLoan,
    tradingFee: currentValue.tradingFee,
  };
  const internalValue = {
    updateMaxVotingPower: 10 ** 256,
    updateMinVotingPower: 10 ** 4,
    updateSignaturesRequired: 7400,
    updateVotingTime: 7233
  }

 
  const updateFunciton = getAllUpdateFunctions();
  const updateFunctionNames = updateFunciton.map((item) => item.name);


  const calculationVariables = [
    { interestPeriods: [3600, 'hrs'] },
    { loanInterestRate: [10 ** 4, '%'] },
    { mmr: [10 ** 4, '%'] },
    { maxLoan: [10 ** 6, 'USDC'] },
    { minHoldingsReqPercentage: [1, '%'] },
    { minLoan: [10 ** 6, 'USDC'] },
    { tradingFee: [10 ** 4, '%'] },
  ];


  const calculationForInternals = [
    { updateMaxVotingPower: [10 ** 18, 'Max Votes per user'] },
    { updateMinVotingPower: [10 ** 18, 'Min shares req'] },
    { updateSignaturesRequired: [10 ** 2, '%'] },
    { updateVotingTime: [3600, 'hrs'] },
  ]
  const theseusMinMax = {
    minmmr: loanPoolTheseus.minMMR,
    maxmmr: loanPoolTheseus.maxMMR,
    minloanInterestRate: loanPoolTheseus.minInterestRate,
    maxloanInterestRate: loanPoolTheseus.maxInterestRate,
    mintradingFee: loanPoolTheseus.minTradingFee,
    maxtradingFee: loanPoolTheseus.maxTradingFee,
    minLoan: loanPoolTheseus.minLoan,  
    maxLoan: loanPoolTheseus.maxLoan,
    minHoldingsReqPercentage: loanPoolTheseus.minHoldingsReqPercentage,
    maxHoldingsReqPercentage: loanPoolTheseus.maxHoldingsReqPercentage,
    mininterestPeriods: loanPoolTheseus.minInterestPeriod,
    maxinterestPeriods: loanPoolTheseus.maxInterestPeriod
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
    setIsError(true);
    setErrorMessage('');
    setInterior('updateMaxVotingPower');
    setInteriorSelect(false);
    setCallData(null);
    setAddressTo(null);
    setDescription('');
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
  const calculateInternalValue = (value: number) => {
    //@ts-ignore
    const arr = calculationForInternals[key][interior];
    //@ts-ignore
    const divisible = arr[0];
    //@ts-ignore
    const unit = arr[1];
    return (value / divisible).toFixed(2) + " " + unit;
  }
  const inverseCalculateValue = (value: number) => {
    //@ts-ignore
    const arr = calculationVariables[key][keys[key]];
    //@ts-ignore
    const muliti = arr[0];
    return value * muliti;
  }
  const inverseInternalCalculateValue = (value: number) => {
    //@ts-ignore
    const arr = calculationForInternals[key][interior];
    //@ts-ignore
    const muliti = arr[0];
    return value * muliti;
  }
  const handleValidation = () => {
    if (inputRef.current) {
      if (interiorSelect) {
        
        const value = Math.floor(inverseInternalCalculateValue(parseFloat(inputRef.current.value)));
        setCheck(true);
        setErrorMessage('');
        setIsError(false);
        //@ts-ignore
        const _callData = getFunctionCallDataAriadne(updateFunctionNames[key], [value]);
        setCallData(_callData);
        setAddressTo(ariadneData.id);
      } else {
        const value = Math.floor(inverseCalculateValue(parseFloat(inputRef.current.value)));
        const min = findMinAndMax(keys[key])[0];
        const max = findMinAndMax(keys[key])[1];
    
        if (value > max) {
          setCheck(false);
          setErrorMessage('Value is too high');
          setIsError(true);
          setCallData(null);
          setAddressTo(null);
        } else if (value < min) {
          setCheck(false);
          setIsError(true);
          setErrorMessage('Value is too low');
          setAddressTo(null);
          setCallData(null);
        } else if (value >= min && value <= max) {
          setCheck(true);
          setErrorMessage('');
          setIsError(false);
          //@ts-ignore
          const _callData = getFunctionCallDataLoanPool(functionNames[key], [value, ammAddress]);
          setAddressTo(loanpool);
          setCallData(_callData);
        } else {
          setCheck(false);
          setErrorMessage('Error');
          setIsError(true);
          setCallData(null);
        }
      }
    }

  }
  useEffect(() => {
    //@ts-ignore
    setDescription(`${selected ? keys[key] : interior}` + ' is being updated to ' + inputRef.current?.value + `${selected ? calculationVariables[key][keys[key]][1] : calculationForInternals[key][interior][1]}` + ' by ' + user)
    return () => {
      setDescription('');
    }
  }, [key, callData]);


  //@ts-ignore
  const handleButton = (index) => {
    const value = ariadneFunctions[index]
    if (value.name) {
      calculateValue(2)
      setKey(index);
      setSelected(true);
      setInteriorSelect(false);
    }
  }
  //@ts-ignore
  const handleInteriorButton = (index) => {
    const value = updateFunciton[index]
    if (value.name) {
      console.log('value.name', value.name)
      setInterior(value.name)
      setKey(index);
      //@ts-ignore
      setDescription(value.name + ' is being updated to ' + inputRef.current?.value + calculationVariables[key][keys[key]][1]+' by ' + user)
      setSelected(false);
      setInteriorSelect(true);
    }
  }
  function handleDescription(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    e.preventDefault();
    const descriptionValue = e.target.value;
    setDescription(descriptionValue);
  }

  return (
    <div>
      <button className='py-4 my-6 text-xl px-8 md:px-32 md:py-12 rounded-full md:my-12  bg-amber-400 hover:shadow-2xl hover:shadow-amber-200 text-white md:text-5xl text-center hover:scale-125' onClick={openModal}>Propose</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Add Collateral Modal"
      >

        <div className='flex flex-row modal-background opacity-90 relative '>
          {(!selected || !interiorSelect) && <button onClick={closeModal} className='text-lg text-white bg-red-500 rounded-full py-[.07rem] px-[.375rem] absolute top-5 right-4'>X</button>}
          {selected && <button onClick={() => setSelected(false)} className='absolute top-5 left-4 text-lg text-white bg-amber-500 rounded-full py-[.07rem] px-[.375rem]'>{'<'}</button>}
          <div className={`${selected || interiorSelect ? 'hidden' : 'flex'}`}>
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
                  <button key={item.name} onClick={() => handleInteriorButton(i)} className='px-2 py-1 text-white bg-blue-800 hover:scale-125 rounded-2xl'>{item.name?.slice(6)}</button>

                )
              })}
            </div>
          </div>
          
          {selected &&(
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
                <div className='flex flex-row justify-between m-2'>
                  <label className='mt-4 text-sm md:text-lg'>
                    Description:
                  </label>

                  <textarea className='text-gray-800 text-sm lg:text-md text-center p-2 rounded-xl'
                    name="postContent"
                    onChange={(e) => handleDescription(e)}
                    // defaultValue={description }
                    placeholder={description}
                    rows={2}
                    cols={25}
                  />
                </div>
              </div>
              {/* @ts-ignore */}
             <DAODetails ariadneData={ariadneData}/>
              <div className='flex flex-row justify-between'>
                <button className='px-2 py-1 bg-red-500 rounded-2xl text-white text-lg hover:scale-125' onClick={closeModal}>Cancel</button>
                {callData && description && !isError && currentId != null && addressTo ? (
                  //@ts-ignore
                  // <Suspense fallback={<div>Loading...</div>}>
                    <ProposeButton user={user} addressTo={addressTo} contractAddress={ariadneData.id} disabled={false} callData={callData} description={description} nonce={currentId} close={closeModal} />
                  // </Suspense>
                ) : (
                  <button disabled className='px-2 py-1 bg-teal-500 rounded-2xl text-white text-lg hover:scale-125'>Loading...</button>
                )}
              </div>
            </div>
          </div>
          )}
          {interiorSelect &&(
          <div className={`${interiorSelect ? 'flex' : 'hidden'}`}>
            <div className='relative flex flex-col p-12'>
              <button onClick={closeModal} className='text-lg text-white bg-red-500 rounded-full py-[.07rem] px-[.375rem] absolute top-5 right-4'>X</button>
              <button onClick={() => setInteriorSelect(false)} className='absolute top-5 left-4 text-lg text-white bg-amber-500 rounded-full py-[.07rem] px-[.375rem]'>{'<'}</button>
              <h1 className='mt-12 mb-4 text-center text-white'>{convertCamelCaseToTitle(interior)}</h1>
              {isError && <p className='text-red-500 text-center text-xl mb-2 animate-pulse'>{errorMessage}</p>}
              <div className='flex flex-col  text-center  gap-x-4 border-2 border-white bg-sky-500 text-white w-full'>
                <div className='flex flex-row justify-between m-2 '>
                  <p className='text-md lg:text-xl pr-8'>Current Value</p>
                  <div className='flex-col'>
                    {interiorSelect && (

                      <>
                        {/* @ts-ignore */}
                        <p className='text-sm  md:text-md lg:text-lg text-sky-100 px-4'>{calculateInternalValue(internalValue[interior])}</p>
                      </>
                    )}
                    <hr />
                  </div>
                </div>
                <div className='flex flex-col justify-between m-2'>
                  <input className=' rounded-3xl text-sky-200 text-md lg:text-lg bg-sky-700 text-center ' type='number' ref={inputRef} onInput={handleValidation} />
                  {interiorSelect && (

                    <>
                      {/* @ts-ignore */}
                      <p className='text-xs lg:text-md '>Proposed Value {calculationForInternals[key][interior][1]}</p>
                    </>
                  )}
                </div>
                <div className='flex flex-row justify-between m-2'>
                  <label className='mt-4 text-sm md:text-lg'>
                    Description:
                  </label>

                  <textarea className='text-gray-800 text-sm lg:text-md text-center p-2 rounded-xl'
                    name="postContent"
                    onChange={(e) => handleDescription(e)}
                    // defaultValue={description }
                    placeholder={description}
                    rows={2}
                    cols={25}
                  />
                </div>
              </div>
              {/* @ts-ignore */}
             <DAODetails ariadneData={ariadneData}/>
              <div className='flex flex-row justify-between'>
                <button className='px-2 py-1 bg-red-500 rounded-2xl text-white text-lg hover:scale-125' onClick={closeModal}>Cancel</button>
                {callData && description && !isError && currentId != null && addressTo ? (
                  //@ts-ignore
                  // <Suspense fallback={<div>Loading...</div>}>
                    <ProposeButton user={user} addressTo={addressTo} contractAddress={ariadneData.id} disabled={false} callData={callData} description={description} nonce={currentId} close={closeModal} />
                  // </Suspense>
                ) : (
                  <button disabled className='px-2 py-1 bg-teal-500 rounded-2xl text-white text-lg hover:scale-125'>Loading...</button>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </Modal>
    </div>
  );
}


