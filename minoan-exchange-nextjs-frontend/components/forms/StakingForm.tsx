"use client";
import { set } from "date-fns";
import { ethers } from "ethers";
import React, { useState,useEffect, use } from "react";
import CurrencyInput from "react-currency-input-field";
import { PoolToken } from "../../types/custom";

// TODO:pull data

interface Props {
  poolToken: PoolToken;
  totalUSDCSupply: number;
}


export default function StakingForm({poolToken,totalUSDCSupply}: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [className, setClassName] = useState("");
  const [rawValue, setRawValue] = useState<string | undefined>(" ");
  const [isError, setIsError] = useState<boolean>(true);
  const [estToken, setEstToken] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const maxValue = poolToken.tokenBalance[0]? poolToken.tokenBalance[0].user.balances.availableUsdc: 0; 
  const totalUsdc = totalUSDCSupply? totalUSDCSupply:0;
  const totalSupply = poolToken.totalSupply? poolToken.totalSupply:0;
  const currentStakeTok = poolToken.tokenBalance[0]? poolToken.tokenBalance[0].tokensOwnedbByUser:0;
  function isGreatMax(num: string) {
    if (maxValue != undefined) {
      if (Number(num) * 1000000 <= maxValue) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  function calcTokenAmt(usdc: number) {

    console.log('total usdsdsdc',usdc/totalUsdc);
    return Math.floor((usdc / totalUsdc) * totalSupply);
  }
  function calcPercentage(usdc: number) {
    let newTOkenAmt= Math.floor((usdc / totalUsdc) * totalSupply);
    return ((newTOkenAmt+ currentStakeTok) /(totalSupply  + newTOkenAmt))*100;
  }
  const validateValue = (value: string | undefined): void => {
    const rawValue = value === undefined ? "$0.00" : value;
    setRawValue(rawValue => String(Number(value) * 1000000) || '0');
    

    if (!value || value === "0") {
      setClassName("");
      setEstToken(0);
      setPercentage(0);
      setErrorMessage("Enter a value greater than 0");
      setIsError(error=>true);
    } else if (Number.isNaN(Number(value))) {
      setErrorMessage("Please enter a valid number");
      setClassName("border border-red-500 bg-red-500");
      setEstToken(0);
      setPercentage(0);
      setIsError(error=>true);
    } else if (isGreatMax(value)) {
      setErrorMessage("Please Deposit more USDC");
      setClassName("border border-red-500 bg-red-500");
      setEstToken(0);
      setIsError(error=>true);
      setPercentage(0);
    } else {
      setClassName("border-2 border-green-500 ");
      setErrorMessage("");
      setIsError(error=>false);
      setEstToken(calcTokenAmt(Number(rawValue) * 1000000));
      setPercentage(calcPercentage(Number(rawValue) * 1000000));
    }
  };

  useEffect(() => {

    return () => {
      
    }
  }, [rawValue, totalUsdc, totalSupply]);

  return (
    <form className="flex flex-col justify-evenly bg-cyan-700 bg-opacity-10 rounded-2xl shadow-xl shadow-amber-400 text-lg p-4 mx-4 lg:mx-36 relative ">
      <h1 className="t-2 rigth-1/2 text-red-500 animate-pulse">
        {errorMessage}
      </h1>
      <div className="flex flex-wrap justify-center">
        <p className=" hidden md:block text-xs text-gray-600 mt-[1.88rem] mr-1">
          USDC
        </p>
        <div className="flex flex-col ">
          <div className="flex flex-row mb-1 ml-12">
            <button className="bg-amber-400 px-2 mt-1 mx-2 text-xs rounded-tl-full ">
              MIN
            </button>
            <button className="bg-amber-400 px-2 mt-1 mx-2 text-xs rounded-tr-full ">
              MAX
            </button>
          </div>
          <CurrencyInput
            id="field"
            max={"99.00"}
            placeholder="$0.00"
            allowDecimals={true}
            className={`text-slate-600  rounded-full text-center ${className} `}
            onValueChange={validateValue}
            prefix={"$"}
          />
          <label htmlFor="" className="px-2 text-xs text-amber-400 ">
            Staking Amount
          </label>
        </div>
        <div className="flex flex-col m-[1.45rem]  md:ml-8 lg:ml-8">
          <div className="bg-white rounded-full text-slate-600 text-center w-[12.5rem] h-[2rem]">
            <p id='rawValue'>{rawValue}</p>
          </div>
          <p className="text-xs text-amber-400">With Decimals</p>
        </div>
        <div className="flex flex-col m-[1.45rem]  md:ml-8 lg:ml-2">
          <div className="bg-white rounded-full text-slate-600 text-center w-[12.5rem] h-[2rem]">
            <p id='estToken'>{ethers.utils.formatUnits(String(estToken),5)}</p>
          </div>
          <p className="text-xs text-amber-400">Aprox Token AMT</p>
        </div>
        <div className="flex flex-col m-[1.45rem]  md:ml-8 lg:ml-2">
          <div className="bg-white rounded-full text-slate-600 text-center w-[12.5rem] h-[2rem]">
            <p id='percentage'>{String(percentage)}%</p>
          </div>
          <p className="text-xs text-amber-400">
            % of Total Supply 
          </p>
        </div>
      </div>
      <button className={`px-4 py-2 ${isError?'bg-red-500/50 ' :'bg-amber-400 hover:animate-pulse'} text-white rounded-3xl mt-4 `} disabled={isError}>
        STAKE
      </button>
    </form>
  );
}
