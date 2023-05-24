'use client';
import React,{useEffect, useState} from 'react'
import { useOpenPosition } from '../../../utils/contractWrites/exchange/openPosition';
import { Address, useContractWrite } from 'wagmi';

interface Props {
    leverage: number,
    side: number,
    collateral: number,
    ammId:string,
    user: Address
    disabled:boolean
}

const TradeButton: React.FC<Props> = ({leverage,collateral,side,user,ammId,disabled}) => {
    const [approved, setApproved] = React.useState<boolean>(false);
    const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);   
    const [loadingStage, setLoadingStage] = useState(false); 
    const collateralAmount = collateral * 10 ** 6;
    const {config,error} = useOpenPosition(side,collateralAmount,leverage,ammId, user);
    console.log('config',config);
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
          <div className="px-2 py-1 rounded-2xl mt-4 font-extrabold bg-teal-400 text-white">
            Processing…
          </div>
        );
      if (errorWithContractLoad)
        return (
          <div className="px-2 py-1 rounded-2xl  mt-4 font-extrabold bg-red-600 text-white animate-pulse">
            Error WIth current transaciton…
          </div>
        );
    return (
        <div className='bg-amber-400 px-2 py-1 rounded-2xl text-white mt-4 hover:scale-125'>
            <button disabled={disabled} onClick={handleWrite} className="">Trade</button>
        </div>
    )
}

export default TradeButton
