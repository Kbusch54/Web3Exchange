'use client'
import React, { useEffect,useState } from 'react'
import {useContractWrite , Address } from 'wagmi';
import { useStake } from '../../../utils/contractWrites/staking/stake';

interface Props {
    value:number,
    ammId:string,
    user:Address
    disabled:boolean
}

export default  function  StakingButton({value,ammId,user,disabled}:Props)  {
    const [approved, setApproved] = React.useState<boolean>(false);
    const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);   
    const [loadingStage, setLoadingStage] = useState(false); 
    // const amount = parseFloat(value);
    const {config,error} = useStake(value,ammId, user);
    const contractWrite = useContractWrite(config);
    console.log('config',config);
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
      //@ts-ignore
      const handleWrite = async (e) => {
        e.preventDefault();
        setLoadingStage((prev) => true);
        //@ts-ignore
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
          <div className="px-2 py-1 rounded-2xl mt-4 font-extrabold bg-teal-400 text-white">
            Processing…
          </div>
        );
      if (errorWithContractLoad)
        return (
          <div className="px-2 py-1 rounded-2xl  mt-4 font-extrabold bg-red-600 text-white animate-pulse">
            Error With current transaciton…
          </div>
        );
    
    return (
        <div className='px-2 mx-12 py-1 rounded-2xl text-white mt-4 font-extrabold bg-amber-400 hover:scale-125'>
            <button disabled={disabled} onClick={handleWrite} >Stake</button>
        </div>
    )
}


