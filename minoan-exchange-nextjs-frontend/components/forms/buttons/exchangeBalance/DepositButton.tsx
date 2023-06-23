'use client'
import React, { useEffect,useRef,useState } from 'react'
import {useContractWrite , Address, useWaitForTransaction } from 'wagmi';
import { useDepositUsdc } from '../../../../utils/contractWrites/exchange/deposit';
import toast from 'react-hot-toast';
import { addTransaction } from '../helper/database';
import { moneyFormatter } from 'utils/helpers/functions';

interface Props {
    value:number,
    user:Address
    disabled:boolean
    handleZero:()=>void
}

export default  function  DepositButton({value,user,disabled,handleZero}:Props)  {
    const [approved, setApproved] = React.useState<boolean>(false);
    const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);    
    const [loadingStage, setLoadingStage] = useState(false); 
    const [customMessage, setCustomMessage] = useState<string|null>(null);
    const {config,error} = useDepositUsdc(value, user);
    const contractWrite = useContractWrite(config);
    const isMounted = useRef(true);
    useEffect(() => {
        if (error == null) {
          setErrorWithContractLoad(false);
        } else {
          setErrorWithContractLoad(true);
        }
      }, [error]);
      const waiting = useWaitForTransaction({hash:contractWrite.data?.hash})
      useEffect(() => {
        if (isMounted.current) {
          if(waiting.isError){
            setLoadingStage((prev) => false);
            setErrorWithContractLoad((prev) => true);
            toast.error(`Error With Transaction ${waiting.error}`, {  duration: 6000 ,position:'top-right'});
            console.log('err',waiting.error);
            isMounted.current = false;
            setTimeout(() => {
              contractWrite.reset();
              isMounted.current = true;
            }, 10000);
          }else if(waiting.isSuccess && waiting.data){
            setApproved(prev=>true)
            setLoadingStage((prev) => false);
            isMounted.current = false;
            toast.success(`$${moneyFormatter(value)} Deposited ${waiting.data.transactionHash}`, {  duration: 6000 ,position:'top-right'});
            const date = new Date().toISOString().toLocaleString();
            addTransaction(waiting.data.transactionHash,user,date,'Deposit','vault').then((res)=>{
              console.log('res added transaction',res);
            })
            setTimeout(() => {
              setApproved(prev=>false)
              contractWrite.reset();
              isMounted.current = true;
              handleZero();
            }, 10000);
              
          }
      }
        return () => {
        }
      }, [waiting])
      //@ts-ignore
      const handleWrite = async (e) => {
        e.preventDefault();
        setLoadingStage((prev) => true);
        //@ts-ignore
         await contractWrite.writeAsync().then((res) => {
          })
          .catch((err) => {
            console.log('err',err);
            setLoadingStage((prev) => false);
            setErrorWithContractLoad((prev) => true);
            toast.error(`Error With Transaction ${err.details}`, {  duration: 6000 ,position:'top-right'});
            setErrorWithContractLoad((prev) => false);
            setCustomMessage(err.details);
            setTimeout(() => {
              contractWrite.reset();
              setCustomMessage(null);
            }, 10000);
          });
         
        };
      if (contractWrite.isLoading || loadingStage)
        return (
          <div className="px-2 py-1 rounded-2xl mt-4 font-extrabold bg-teal-400 text-white">
            Processing…
          </div>
        );
        if (errorWithContractLoad)
      return (
        <div className="px-2 py-1 rounded-2xl  mt-4 font-extrabold bg-red-600 text-white animate-pulse">
          {customMessage? (
            <p>{customMessage}</p>
          ):(
            <p>Error With current transaciton…</p>
          )}
        </div>
      );
      if (approved)
          return (
            <div className="px-2 py-1 rounded-2xl  mt-4 font-extrabold bg-green-600 text-white animate-pulse">
              Deposited Successfully
            </div>
          );
    return (
        <div>
            <button disabled={disabled} onClick={handleWrite} className='px-2 py-1 rounded-2xl text-white mt-4 font-extrabold bg-amber-400 hover:scale-125'>Deposit</button>
        </div>
    )
}


