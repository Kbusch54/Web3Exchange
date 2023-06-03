'use client'
import React, { use, useEffect,useState } from 'react'
import {useContractWrite , Address } from 'wagmi';
import { useRemoveLiquidity } from '../../../../utils/contractWrites/exchange/removeLiquidity';
import { getPayload } from '../../../../utils/contractWrites/exchange';

interface Props {
    value:number,
    tradeId:string,
    user:Address,
    disabled:boolean
}

export default  function  RemoveLiquidityButton({value,user,disabled,tradeId}:Props)  {
    const [approved, setApproved] = React.useState<boolean>(false);
    const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);   
    const [loadingStage, setLoadingStage] = useState(false); 
    const payload = use(getPayload());
    const {config,error} = useRemoveLiquidity( user,tradeId,value,payload);
    const contractWrite = useContractWrite(config);
    useEffect(() => {
        if (error == null) {
          setErrorWithContractLoad(false);
        } else {
          setErrorWithContractLoad(true);
        }
      }, [error]);
      //@ts-ignore
      const handleWrite = async (e) => {
        e.preventDefault();
        setLoadingStage((prev) => true);
        //@ts-ignore
        // await contractWrite.writeAsync()
        
        // console.log('contractWrite',contractWrite);
         await contractWrite.writeAsync()
          .then((con: { wait: (arg0: number) => Promise<any>; hash: any; }) => {
            con.wait(1).then((res) => {
              if (contractWrite.isSuccess || res.status == 1) {
                console.log(res.transactionHash);
              } else if (
                contractWrite.status == "idle" ||
                contractWrite.status == "error" ||
                contractWrite.isIdle == true ||
                res.status == 0
              ) {
                console.log("error see traNSACITON HASH", con.hash);
                console.log(contractWrite?.error?.message);
              } else {
                console.log("error see traNSACITON HASH", con.hash);
                console.log(contractWrite?.error?.message);
              }
            });
          })
          .catch((err: any) => {
            console.log("didnt event fire", err);
          });
      };
      if (contractWrite.isLoading || loadingStage)
        return (
          <div className="px-2 py-1 rounded-lg bg-teal-400 text-white">
            Processing…
          </div>
        );
      if (errorWithContractLoad)
        return (
          <div className=" px-2 py-1 rounded-lg bg-red-600 text-white animate-pulse">
            <p className='text-xs md:text-md lg:text-lg'>
              Error With current transaciton…
              </p> 
          </div>
        );
    
    return (
        <div>
            <button disabled={disabled} onClick={handleWrite} className='px-2 py-1 text-white bg-sky-800 rounded-lg'>Remove Liquidity</button>
        </div>
    )
}


