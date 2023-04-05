"use client";
import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";

// TODO:pull data
// users usdc
// minimum stake allowed
// total usdc supply
// total token supply

export default function StakingForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [className, setClassName] = useState("");
  const [rawValue, setRawValue] = useState<string | undefined>(" ");
  const [maxValue, setMaxValue] = useState<Number | undefined>(99000000);
  const [estToken, setEstToken] = useState<Number>(0);

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
  function calcTokenAmt(usdc: number, totalUsdc: number, totalSupply: number) {
    return Math.floor((usdc / totalUsdc) * totalSupply);
    // _usdcAmt) / tUsdcS)*ts
  }
  const validateValue = (value: string | undefined): void => {
    const rawValue = value === undefined ? "$0.00" : value;
    setRawValue(String(Number(rawValue) * 1000000) || "$0.00");

    console.log("rawvalue with usdc dec", Number(rawValue) * 1000000);

    if (!value) {
      setClassName("");
      setEstToken(0);
    } else if (Number.isNaN(Number(value))) {
      setErrorMessage("Please enter a valid number");
      setClassName("border border-red-500 bg-red-500");
      setEstToken(0);
    } else if (isGreatMax(value)) {
      setErrorMessage("Value you entered is more USDC than you own");
      setClassName("border border-red-500 bg-red-500");
      setEstToken(0);
    } else {
      setClassName("border-2 border-green-500 ");
      setErrorMessage("");
      setEstToken(calcTokenAmt(Number(rawValue) * 1000000, 2000000000, 90828));
    }
  };

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
            <p>{rawValue}</p>
          </div>
          <p className="text-xs text-amber-400">With Decimals</p>
        </div>
        <div className="flex flex-col m-[1.45rem]  md:ml-8 lg:ml-2">
          <div className="bg-white rounded-full text-slate-600 text-center w-[12.5rem] h-[2rem]">
            <p>{String(estToken)}</p>
          </div>
          <p className="text-xs text-amber-400">Aprox Token AMT</p>
        </div>
        <div className="flex flex-col m-[1.45rem]  md:ml-8 lg:ml-2">
          <div className="bg-white rounded-full text-slate-600 text-center w-[12.5rem] h-[2rem]">
            <p>$2.40</p>
          </div>
          <p className="text-xs text-amber-400">
            Estimated Rewards Next Period
          </p>
        </div>
      </div>
      <button className="px-4 py-2 bg-amber-400 text-white rounded-3xl mt-4 hover:animate-pulse">
        STAKE
      </button>
    </form>
  );
}
