'use client'
import React, { useEffect,useState } from 'react'
import {useContractWrite , Address } from 'wagmi';
import { useApproveUsdc } from '../../../utils/contractWrites/approve';

interface Props {
    value:number,
    user:Address
    disabled:boolean
}

export default  function  ApproveButton({value,user,disabled}:Props)  {
    const [approved, setApproved] = React.useState<boolean>(false);
    const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);   
    const [loadingStage, setLoadingStage] = useState(false); 
    const {config,error} = useApproveUsdc(value, user);
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
          <div className="absolute bottom-8 right-8 px-8 py-2  rounded-3xl bg-teal-400 text-white">
            Processing…
          </div>
        );
      if (errorWithContractLoad)
        return (
          <div className="absolute bottom-8 right-8 px-8 py-2  rounded-3xl bg-red-600 text-white animate-pulse">
            Error WIth current transaciton…
          </div>
        );
    
    return (
        <div>
            <button disabled={disabled} onClick={handleWrite} className='px-2 py-1 rounded-2xl text-white mt-4 font-extrabold bg-amber-400 hover:scale-125'>Approve</button>
        </div>
    )
}

// export default ApproveButton


