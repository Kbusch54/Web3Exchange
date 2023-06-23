'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useContractWrite, Address, useWaitForTransaction } from 'wagmi';
import { useExecuteProposal } from '../../../../utils/contractWrites/daos/ariadne/execute';
import toast from 'react-hot-toast';
import { executedProposal } from '../helper/database';

interface Props {
  callData: string,
  user: Address,
  disabled: boolean,
  signatures: string[],
  nonce: number,
  addressTo: Address,
  ariadneAdd: Address

}

export default function ExecuteProposalButton({ user, disabled, callData, nonce, addressTo, signatures, ariadneAdd }: Props) {
  const [approved, setApproved] = React.useState<boolean>(false);
  const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState(false);
  const isMounted = useRef(true);
  const { config, error } = useExecuteProposal(Number(nonce), addressTo, callData, signatures, ariadneAdd, user);


  const contractWrite = useContractWrite(config);
  useEffect(() => {
    if (error == null) {
      setErrorWithContractLoad(false);
    } else {
      setErrorWithContractLoad(true);
    }
  }, [error]);
  const waiting = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  })
  useEffect(() => {
    if (isMounted.current) {
      if (waiting.isError) {
        setLoadingStage((prev) => false);
        setErrorWithContractLoad((prev) => true);
        toast.error(`Error With Transaction ${waiting.error}`, { duration: 6000, position: 'top-right' });
        console.log('err', waiting.error);
        isMounted.current = false;
        setTimeout(() => {
          contractWrite.reset();
          isMounted.current = true;
        }, 10000);
      } else if (waiting.isSuccess && waiting.data) {
        setLoadingStage((prev) => false);
        isMounted.current = false;
        executedProposal(ariadneAdd, nonce, user, waiting.data.transactionHash).then((res) => {
          setApproved(prev => true)
          toast.success(`Executed ${nonce} `, { duration: 6000, position: 'top-right' });
        })
        setTimeout(() => {
          contractWrite.reset();
          isMounted.current = true;
        }, 8000);

      }
    }
    return () => {
    }
  }, [waiting])

  //@ts-ignore
  const handleWrite = async (e) => {
    e.preventDefault();
    setLoadingStage((prev) => true);
    console.log('contractWrite ddd', contractWrite);
    //@ts-ignore
    await contractWrite.writeAsync().then((res) => {
    })
      .catch((err) => {
        console.log('err', err);
        setLoadingStage((prev) => false);
        setErrorWithContractLoad((prev) => true);
        toast.error(`Error With Transaction ${err.details}`, { duration: 6000, position: 'top-right' });
        setTimeout(() => {
          setErrorWithContractLoad((prev) => false);
          contractWrite.reset();
        }, 10000);
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
  if (approved)
    return (
      <button disabled className=" px-2 py-1 rounded-lg bg-green-600 text-white animate-pulse text-xs md:text-md lg:text-lg">
        Success
      </button>
    );

  return (
    <div className={`${approved ? 'hidden' : 'block'}`}>
      <button disabled={disabled} onClick={handleWrite} className='bg-amber-500 px-2 py-1  rounded-2xl text-white text-lg hover:scale-125'>Execute</button>
    </div>
  )

}
