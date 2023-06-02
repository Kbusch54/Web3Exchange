"use client";
import { set } from "date-fns";
import { ethers } from "ethers";
import React, { useState,useEffect, useRef } from "react";
import { PoolToken } from "../../types/custom";
import { Address } from "wagmi";
import UnStakingButton from "./buttons/staking/UnStakingButton";



interface Props {
  poolToken: PoolToken;
  totalUSDCSupply: number;
  poolAvailableUsdc: number;
  name: string;
  user:Address;
}


export default function UnStakingForm({poolToken,totalUSDCSupply,poolAvailableUsdc,name,user}: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [className, setClassName] = useState("");
  const [isError, setIsError] = useState<boolean>(true);
  const [rawDecimal, setRawDecimal] = useState<number>(0);
  const totalUsdc = totalUSDCSupply? totalUSDCSupply:0;
  const tokenSupply = poolToken.totalSupply? poolToken.totalSupply:0;
  
  const tokensOwned = poolToken.tokenBalance? poolToken.tokenBalance[0].tokensOwnedbByUser:0;
  const maxValue = tokensOwned; 
  const tokenRef = useRef<HTMLInputElement>(null);
  const decimalsRef = useRef<HTMLInputElement>(null);
  const estUsdcRef = useRef<HTMLInputElement>(null);
  const maxInput = (e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    if(maxValue != undefined){
      if(tokenRef.current) tokenRef.current.value = String((maxValue/10**18).toFixed(10));
      validateValue(String(maxValue));
    }else{
      return 0;
    }
  }
  const minInput = (e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    if(maxValue != undefined){
      if(tokenRef.current) tokenRef.current.value = String((0.0001).toFixed(10));
      validateValue(String(0.0001*10**18));
    }else{
      return 0;
    }
  }
  function isGreatMax(num: string) {
    if (maxValue != undefined) {
      if (Number(num) <= maxValue && Number(num) <= tokensOwned) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  function calcUsdcAmt(amountToBurn: number) {
    const porportion = (amountToBurn * 1e6) / tokenSupply;
    const amount = (totalUsdc * porportion) / 1e6;
    return amount;
  }

  const validate = () => {
    if (tokenRef.current) {
      if(decimalsRef.current) decimalsRef.current.value ='0'
      validateValue(String(parseFloat(tokenRef.current.value)*10**18));
    }
  }

  const validateValue = (value: string | undefined ): void => {
    if(decimalsRef.current) decimalsRef.current.value = String(Number(value)) || '0';

    if (!value || value === "0") {
      setClassName("");
      setErrorMessage("Enter a value greater than 0");
      setIsError(error=>true);
      if(estUsdcRef.current) estUsdcRef.current.value = '0';
    } else if (Number.isNaN(Number(value))) {
      setErrorMessage("Please enter a valid number");
      setClassName("border border-red-500 bg-red-500");
      setIsError(error=>true);
      if(estUsdcRef.current) estUsdcRef.current.value = '0';
    } else if (isGreatMax(value)) {
      setErrorMessage("Please Deposit more USDC");
      setClassName("border border-red-500 bg-red-500");
      setIsError(error=>true);
      if(estUsdcRef.current) estUsdcRef.current.value = '0';
    }else if(Number(value) <1){
      setErrorMessage("Minimum is $1");
      setClassName("border border-red-500 bg-red-500");
      setIsError(error=>true);
      if(estUsdcRef.current) estUsdcRef.current.value = '0';
    } else {
      setClassName("border-2 border-green-500 ");
      setErrorMessage("");
      setIsError(error=>false);
      setRawDecimal(prevState=>Number(value));
      if(estUsdcRef.current) estUsdcRef.current.value = '$'.concat(String((calcUsdcAmt(Number(value))/10**6).toFixed(2)));
    }
  };

  useEffect(() => {
    return () => {
      setErrorMessage("");
      setClassName("");
      setIsError(error=>false);
    }
  }, [totalUsdc, tokenSupply,rawDecimal]);


  return (
    <form className="flex flex-col justify-evenly bg-cyan-700 bg-opacity-10 rounded-2xl shadow-xl shadow-amber-400 text-lg p-4 mx-4 lg:mx-36 relative ">
      <h1 className="t-2 rigth-1/2 text-red-500 animate-pulse">
        {errorMessage}
      </h1>
      <p>{tokensOwned?tokensOwned/10**18:0}</p>
      <div className="flex flex-wrap justify-center">
        <p className=" hidden md:block text-xs text-gray-600 mt-[1.88rem] mr-1">
          Tokens
        </p>
        <div className="flex flex-col ">
          <div className="flex flex-row mb-1 ml-12">
            <button onClick={(e)=>minInput(e)} className="bg-amber-400 px-2 mt-1 mx-2 text-xs rounded-tl-full ">
              MIN
            </button>
            <button onClick={(e)=>maxInput(e)} className="bg-amber-400 px-2 mt-1 mx-2 text-xs rounded-tr-full ">
              MAX
            </button>
          </div>
          <input
            id="usdc"
            ref={tokenRef}
            placeholder="0"
            className={`text-slate-600  rounded-full text-center ${className} `}
            onInput={()=>validate()}
            prefix={"$"}
          />
          <label htmlFor="" className="px-2 text-xs text-amber-400 ">
            unStaking Amount
          </label>
        </div>
        <div className="flex flex-col m-[1.45rem]  md:ml-8 lg:ml-8">
            <input className="bg-white rounded-full text-slate-600 text-center w-[12.5rem] h-[2rem]"  ref={decimalsRef}/>
          <p className="text-xs text-amber-400">With Decimals</p>
        </div>
        <div className="flex flex-col m-[1.45rem]  md:ml-8 lg:ml-2">
            <input className="bg-white rounded-full text-slate-600 text-center w-[12.5rem] h-[2rem]" ref={estUsdcRef}/>
          <p className="text-xs text-amber-400">Aprox USDC</p>
        </div>
      </div>
      {!decimalsRef.current &&rawDecimal?(
          <button className={`px-4 py-2 ${isError?'bg-red-500/50 ' :'bg-amber-400 hover:animate-pulse'} text-white rounded-3xl mt-4 `} disabled={isError}>Stake</button>
      ):
      (
        <UnStakingButton disabled={isError} ammId={name} value={rawDecimal} user={user}   />
      )}
    </form>
  );
}
