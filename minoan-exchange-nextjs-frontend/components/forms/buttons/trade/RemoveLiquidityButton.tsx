'use client'
import React, { useEffect,useState } from 'react'
import {useContractWrite , Address, useWaitForTransaction } from 'wagmi';
import { useRemoveLiquidity } from '../../../../utils/contractWrites/exchange/removeLiquidity';
import { getPayload } from '../../../../utils/contractWrites/exchange';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';

interface Props {
    value:number,
    tradeId:string,
    user:Address,
    disabled:boolean
    payload:string
}

export default  function  RemoveLiquidityButton({value,user,disabled,tradeId,payload}:Props)  {
  const [approved, setApproved] = React.useState<boolean>(false);
  const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);    
  const [loadingStage, setLoadingStage] = useState(false); 
  const [customMessage, setCustomMessage] = useState<string|null>(null);
    const {config,error} = useRemoveLiquidity( user,tradeId,value,payload);
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
        if(contractWrite.isLoading){
            setLoadingStage(true);
        }else{
            setLoadingStage(false);
        }
      }, [error]);
      useEffect(() => {
        if(data){
         
          if ( data.status == 'success'|| contractWrite.status == 'success') {
            console.log(data.transactionHash);
            contractWrite.reset();
            setLoadingStage((prev) => false);
            setApproved(prev=>true)
            //custom message for 3 seconds then reset
            
            toast.success(`$${value} Added liquidity ${data.transactionHash}`, {  duration: 6000 ,position:'top-right'});
            setCustomMessage('You have staked');
            setTimeout(() => {
              setCustomMessage(null);
              setApproved(prev=>false)
              contractWrite.reset();
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
      if(approved){
        return (
          <div className="px-2 py-1 rounded-2xl  mt-4 font-extrabold bg-blue-600 text-white animate-pulse">
            <p>{customMessage}</p>
          </div>

        )
      }
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
            <button disabled={disabled} onClick={handleWrite} className='px-2 py-1 text-white bg-sky-800 rounded-lg'>Remove Liquidity</button>
        </div>
    )
}


