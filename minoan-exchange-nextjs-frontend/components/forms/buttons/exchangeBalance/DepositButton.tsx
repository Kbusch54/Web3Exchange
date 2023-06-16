'use client'
import React, { useEffect,useState } from 'react'
import {useContractWrite , Address, useWaitForTransaction } from 'wagmi';
import { useDepositUsdc } from '../../../../utils/contractWrites/exchange/deposit';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

interface Props {
    value:number,
    user:Address
    disabled:boolean
}

export default  function  DepositButton({value,user,disabled}:Props)  {
    const [approved, setApproved] = React.useState<boolean>(false);
    const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);    
    const [loadingStage, setLoadingStage] = useState(false); 
    const [customMessage, setCustomMessage] = useState<string|null>(null);
    const {config,error} = useDepositUsdc(value, user);
    const contractWrite = useContractWrite(config);
    const { data, isError, isLoading,isSuccess } = useWaitForTransaction({
      hash: contractWrite.data?.hash,
    })
    useEffect(() => {
        if (error == null) {
          setErrorWithContractLoad(false);
        } else {
          setErrorWithContractLoad(true);
        }
      }, [error]);
      useEffect(() => {
        if(data){
         
          if ( data.status == 'success'|| contractWrite.status == 'success') {
            console.log(data.transactionHash);
            contractWrite.reset();
            setLoadingStage((prev) => false);
            //custom message for 3 seconds then reset
            
            toast.success(`$${value} Deposited ${data.transactionHash}`, {  duration: 6000 ,position:'top-right'});
            setCustomMessage('Deposited');
            setTimeout(() => {
              setCustomMessage(null);
              redirect('/pools/TSLA');
            }
            , 8000);
          }
              } 
              else if (
                contractWrite.status == "idle" ||
                contractWrite.status == "error" ||
                contractWrite.isIdle == true 
              ) {
                console.log("error see traNSACITON HASH", error);
                console.log(contractWrite?.error?.message);
              } else {
                console.log("error see traNSACITON HASH", isError);
                console.log(contractWrite?.error?.message);
              }
            },[data]);
              
      //@ts-ignore
      const handleWrite = async (e) => {
        e.preventDefault();
        setLoadingStage((prev) => true);
        //@ts-ignore
        // await contractWrite.writeAsync()
        
        // console.log('contractWrite',contractWrite);
         await contractWrite.writeAsync().then(con=>{

            }).catch((err: any) => {
            console.log("didnt event fire", err);
            if(err.message.includes('User rejected request')){
              console.log('user rejected');
              contractWrite.reset();
              setLoadingStage((prev) => false);
              //error isContractError for 3 seconds then reset
              setErrorWithContractLoad(true);
              setCustomMessage('User rejected request');
              setTimeout(() => {
                setErrorWithContractLoad(false);
                setCustomMessage(null);
              }
              , 3000);
            };
            console.log("didnt event fire", err);
            console.log('message',err.message);
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
    
    return (
        <div>
            <button disabled={disabled} onClick={handleWrite} className='px-2 py-1 rounded-2xl text-white mt-4 font-extrabold bg-amber-400 hover:scale-125'>Deposit</button>
        </div>
    )
}


