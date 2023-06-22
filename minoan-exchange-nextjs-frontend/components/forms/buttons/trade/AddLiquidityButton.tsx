'use client'
import React, { useEffect,useRef,useState } from 'react'
import {useContractWrite , Address, useWaitForTransaction } from 'wagmi';
import { useAddLiquidity } from '../../../../utils/contractWrites/exchange/addLiquidity';
import toast from 'react-hot-toast';
import EtherscanLogo from 'components/tables/utils/EtherscanLogo';
import { moneyFormatter } from 'utils/helpers/functions';
import { addTransaction } from '../helper/database';

interface Props {
    value:number,
    tradeId:string,
    user:Address,
    leverage:number,
    disabled:boolean
    payload:string
    close:()=>void
}

export default  function  AddLiquidityButton({value,user,disabled,tradeId,leverage,payload,close}:Props)  {
  const [approved, setApproved] = React.useState<boolean>(false);
  const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);    
  const [loadingStage, setLoadingStage] = useState(false); 
  const [customMessage, setCustomMessage] = useState<string|null>(null);
    const {config,error} = useAddLiquidity( user,tradeId,leverage,value,payload);
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
            toast.custom((t) => (
              <div className='bg-slate-800 border-2 border-amber-500 px-24 py-2 rounded-3xl flex flex-col justify-center text-center gap-y-4'>
                <div className="text-3xl text-amber-400">Added Liquidity</div>
                <div className="flex flex-row justify-around">
                </div>
                <div className="flex flex-col justify-between mt-4 bg-amber-400 rounded-3xl">
                  <p className='text-white text-lg'>Collateral ${moneyFormatter(value)}</p>
                  <p className='text-white text-lg'>Leverage {leverage}X</p>
              </div>
              <EtherscanLogo txHash={waiting.data?waiting.data.transactionHash:''}/>
              </div>
            ), {
              duration: 6000,
              position: 'top-right',
            });
            const date = new Date().toISOString().toLocaleString();
            addTransaction(waiting.data.transactionHash,user,date,'Add Liquidity','trade').then((res)=>{
              console.log('res added transaction',res);
            })
            setTimeout(() => {
              setApproved(prev=>false)
              contractWrite.reset();
              isMounted.current = true;
              close()
            }, 6000);
              
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
              close()
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
            <div className="px-2 py-1 rounded-2xl  mt-4 font-extrabold bg-sky-600 text-white animate-pulse">
              Added Liquidity Successfully
            </div>
          );
    return (
        <div>
            <button disabled={disabled} onClick={handleWrite} className='px-2 py-1 text-white bg-sky-800 rounded-lg'>Add Liquidity</button>
        </div>
    )
}


