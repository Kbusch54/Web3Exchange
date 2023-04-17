'use client'
import React, { useState } from 'react'
import CurrencyInput from "react-currency-input-field";
interface Props {
    
}

//fetch data from acount data and vaultBalances then pass it to the form revalidating every 30 seconds


const VaultUSDCForm: React.FC<Props> = () => {
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
        <div className="outside-box mt-8 ">
        <div className="flex flex-col text-center inside-box text-white ">
          <h3>USDC</h3>
          <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between m-2">
            <div className="flex flex-col justify-center">
              <p className="bg-white rounded-full text-slate-600 text-center md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem]">$443.89</p>
              <p className="text-sm xl:text-lg text-amber-400">Available Vault Balance</p>
            </div>
            <div className="flex flex-col">
              <p className="bg-white rounded-full text-slate-600 text-center md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem]">$87,443.89</p>
              <p className="text-sm xl:text-lg text-amber-400">Wallet Balance</p>
            </div>
          </div>
        <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between m-2">
          <div className="flex flex-col">
            {/* TODO: 
                add max value of total wallet balance
                add error for going above wallet balance */}
            <div className="flex flex-row justify-between bg-white rounded-full text-slate-600 text-center md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem]">
              {/* <input type="text" className="rounded-l-xl w-32 lg:w-24 xl-w-32 text-center " /> */}
              <CurrencyInput
            id="field"
            max={"99.00"}
            placeholder="$0.00"
            allowDecimals={true}
            className={`text-slate-600 w-32 lg:w-24 xl-w-32  rounded-l-full text-center ${className} `}
            onValueChange={validateValue}
            prefix={"$"}
          />
              <button className="bg-amber-400 p-1 pr-3 rounded-r-full">MAX</button>
            </div>
              <p className="text-sm xl:text-lg text-amber-400">Deposit</p>
          </div>
          <div className="flex flex-col">
            {/* TODO: 
                add max value of total avaiable vault balance
                add error for going above avaiable vault balance*/}
            <div className="flex flex-row justify-between bg-white rounded-full text-slate-600 text-center md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem]">
              {/* <input type="text" className="rounded-l-xl w-32 lg:w-24 xl-w-32 text-center" /> */}
              <CurrencyInput
            id="field"
            max={"99.00"}
            placeholder="$0.00"
            allowDecimals={true}
            className={`text-slate-600  rounded-l-full w-32 lg:w-24 xl-w-32 text-center ${className} `}
            onValueChange={validateValue}
            prefix={"$"}
          />
              <button className="bg-amber-400  p-1 pr-3 rounded-r-full">MAX</button>
            </div>
              <p className="text-sm xl:text-lg text-amber-400">Withdraw</p>
          </div>
        </div>
          <button className="bg-amber-400 px-2 py-1 rounded-2xl text-white mt-4 hover:scale-125">
            EXECUTE
          </button>
        </div>
      </div>
    )
}

export default VaultUSDCForm




