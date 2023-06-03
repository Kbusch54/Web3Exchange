'use client';
import React,{use, useEffect, useState} from 'react'
import { useOpenPosition } from '../../../../utils/contractWrites/exchange/openPosition';
import { Address, useContractWrite } from 'wagmi';
import { getPayload } from '../../../../utils/contractWrites/exchange';

interface Props {
    leverage: number,
    side: number,
    collateral: number,
    ammId:string,
    user: Address
    disabled:boolean
    payload:string
}

const TradeButton: React.FC<Props> = ({leverage,collateral,side,user,ammId,disabled,payload}) => {
    const [approved, setApproved] = React.useState<boolean>(false);
    const [errorWithContractLoad, setErrorWithContractLoad] = React.useState<boolean>(false);   
    const [loadingStage, setLoadingStage] = useState(false); 
    const [customMessage, setCustomMessage] = useState<string|null>(null);
    const collateralAmount = collateral * 10 ** 6;
    // const payload = use(getPayload());
    console.log('payload',payload);
    const {config,error} = useOpenPosition(side,collateralAmount,leverage,ammId, user,payload);
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
         await contractWrite.writeAsync()
         .then((con: { wait: (arg0: number) => Promise<any>; hash: any; }) => {
            con.wait(1).then((res) => {
              if (contractWrite.isSuccess || res.status == 1) {
                //success
                console.log(res.transactionHash); contractWrite.reset();
                setLoadingStage((prev) => false);
                //custom message for 3 seconds then reset
                setCustomMessage('Trade Successful');
                setTimeout(() => {
                  setCustomMessage(null);
                }
                , 3000);
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
        <div className='bg-amber-400 px-2 py-1 rounded-2xl text-white mt-4 hover:scale-125'>
            <button disabled={disabled} onClick={handleWrite} className="">{customMessage?customMessage:'Trade'}</button>
        </div>
    )
}

export default TradeButton
