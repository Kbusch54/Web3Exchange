"use client";
import React, { useEffect, useRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { getWalletBalanceForAddress } from "../../utils/acountdata";
import { getVaultBalanceForAddress } from "../../utils/vaultBalances";
interface Props { }

//fetch data from acount data and vaultBalances then pass it to the form revalidating every 30 seconds

const VaultUSDCForm: React.FC<Props> = () => {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [vaultBalance, setVaultBalance] = useState<number | null>(null);
  const address = "0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42";
  const depositRef = useRef<HTMLInputElement>(null);
  const withdrawRef = useRef<HTMLInputElement>(null);

  function rawToDisplay(value: number | null) {
    if (value === undefined) {
      return "$0.00";
    } else {
      return "$" + (Number(value) / 1000000).toFixed(2);
    }
  }
  useEffect(() => {
    const fetchBalance = async () => {
      const fetchedBalance = getWalletBalanceForAddress(address);
      fetchedBalance != null
        ? setWalletBalance(fetchedBalance)
        : setWalletBalance(0);
    };

    fetchBalance();

    const intervalId = setInterval(fetchBalance, 30 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [address]);

  useEffect(() => {
    const fetchBalance = async () => {
      const fetchedBalance = getVaultBalanceForAddress(address);
      fetchedBalance != null ? setVaultBalance(fetchedBalance) : 0;
    };

    fetchBalance();

    const intervalId = setInterval(fetchBalance, 30 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [address]);
  const [errorMessage, setErrorMessage] = useState("");
  const [className, setClassName] = useState("");
  const [withdrawRawValue, setWithdrawRawValue] = useState<number | null>(

  );
  const [depositRawValue, setDepositRawValue] = useState<number | null>();
  const [withdrawDisplayValue, setWithdrawDisplayValue] = useState<
    string | undefined
  >("");
  const [depositDisplayValue, setDepositDisplayValue] = useState<
    string | undefined
  >("");
  const [buttonValue, setButtonValue] = useState<string | undefined>("Deposit");

  const handleDepositFocus = (e: React.ChangeEvent<HTMLInputElement>): void => {
    /* @ts-ignore */
    withdrawRef.current.value = "$0.00";
    console.log("handle deposit focus");
    setWithdrawRawValue(0);
    setWithdrawDisplayValue("$0.00");
  };
  const handleWithdrawFocus = (e: React.ChangeEvent<HTMLInputElement>): void => {
    /* @ts-ignore */
    depositRef.current.value = "$20.00";
    console.log("handle withdraw focus");
    setDepositRawValue(0);
    setDepositDisplayValue("$0.00");
  };

  const depositValueCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {

    const rawValue = e.target.value === null ? 0 : Number(e.target.value);
    setDepositRawValue(Number(rawValue) * 1000000 || 0);
    setDepositDisplayValue(rawToDisplay(rawValue*1000000));

    if (Number(rawValue)*1000000 > Number(walletBalance)) {
      setErrorMessage("Value you entered is more USDC than you own");
      setClassName("border border-red-500 bg-red-500");
    } else {
      validateValue(rawValue);
      setButtonValue("Deposit");
      console.log("deposit value check raw num", e.target.value,depositRawValue,rawValue);
      console.log("deposit value check USDC", depositDisplayValue,rawToDisplay(rawValue*1000000));
    }
  };
  const withdrawValueCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {

    const rawValue = e.target.value === null ? 0 : Number(e.target.value);
    console.log("withdraw value check", e.target.value);
    setWithdrawRawValue(Number(rawValue) * 1000000 || 0);
    setWithdrawDisplayValue(rawToDisplay(rawValue*1000000));
    console.log('withdraw raw',withdrawRawValue,'vault balance',vaultBalance);
    if (Number(rawValue)*1000000 > Number(vaultBalance)) {
      setErrorMessage(
        "Value you entered is more USDC than available in the vault"
      );
      setClassName("border border-red-500 bg-red-500");
    } else {
      validateValue(rawValue);
      setButtonValue("Withdraw");
      
    }
  };

  const validateValue = (value: number | undefined): void => {
    const rV = value === undefined ? "$0.00" : value;
    console.log("going through validate check", value, rV);
    if (!value) {
      setClassName("");
    } else if (Number.isNaN(Number(value))) {
      setErrorMessage("Please enter a valid number");
      setClassName("border border-red-500 bg-red-500");
    } else {
      setClassName("border-2 border-green-500 ");
      setErrorMessage("");
    }
  };
  const handleMaxDeposit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    //@ts-ignore
    handleDepositFocus(e);
    setDepositRawValue(walletBalance);
    setDepositDisplayValue(rawToDisplay(walletBalance));
    const maxDepositValueFormatted = parseFloat(String(walletBalance !=null? walletBalance/1000000:0)).toFixed(2);
    setDepositDisplayValue(maxDepositValueFormatted);
    if (depositRef.current) {
      depositRef.current.value = maxDepositValueFormatted;
    }
    setButtonValue("Deposit");
  };
  const handleMaxWithdraw = (e: React.MouseEvent<HTMLButtonElement>): void => {
    //@ts-ignore
    handleWithdrawFocus(e);
    setWithdrawRawValue(vaultBalance);
    setWithdrawDisplayValue(rawToDisplay(vaultBalance));
    const maxWithdrawValueFormatted = parseFloat(String(vaultBalance !=null? vaultBalance/1000000:0)).toFixed(2);
    setWithdrawDisplayValue(maxWithdrawValueFormatted);
    if (withdrawRef.current) {
      withdrawRef.current.value = maxWithdrawValueFormatted;
    }
    setButtonValue("Withdraw");
  };
  return (
    <div className="outside-box mt-8 ">
      <div className="flex flex-col text-center inside-box text-white ">
        <h3>USDC</h3>
        <p className="text-red-500 animate-pulse">{errorMessage}</p>
        <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between m-2">
          <div className="flex flex-col justify-center">
            <p className="bg-white rounded-full text-slate-600 text-center md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem]">
              {rawToDisplay(vaultBalance)}
            </p>
            <p className="text-sm xl:text-lg text-amber-400">
              Available Vault Balance
            </p>
          </div>
          <div className="flex flex-col">
            <p className="bg-white rounded-full text-slate-600 text-center md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem]">
              {rawToDisplay(walletBalance)}
            </p>
            <p className="text-sm xl:text-lg text-amber-400">Wallet Balance</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between m-2">
          <div className="flex flex-col">
            {/* TODO: 
                add max value of total avaiable vault balance
                add error for going above avaiable vault balance*/}
            <div className="flex flex-row justify-between bg-white rounded-full text-slate-600 text-center md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem]">
              <input
                type="number"
                ref={withdrawRef}
                className={`text-slate-600 w-32 lg:w-24 xl-w-32  rounded-l-full text-center ${className} `}
                onFocus={handleWithdrawFocus}
                max={vaultBalance?vaultBalance:0}
                step="0.01"
                placeholder="$0.00"
                prefix="$"
                onChange={(e) => withdrawValueCheck(e)}
              />
              <button onClick={handleMaxWithdraw} className="bg-amber-400  p-1 pr-3 rounded-r-full">
                MAX
              </button>
            </div>
            <p className="text-sm xl:text-lg text-amber-400">Withdraw</p>
          </div>
          <div className="flex flex-col">
            {/* TODO: 
                add max value of total wallet balance
                add error for going above wallet balance */}
            <div className="flex flex-row justify-between bg-white rounded-full text-slate-600 text-center md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem]">
        
              <input
              ref={depositRef}
                type="number"
                className={`text-slate-600 w-32 lg:w-24 xl-w-32  rounded-l-full text-center ${className} `}
                onFocus={handleDepositFocus}
                step="0.01"
                placeholder="$0.00"
                max={walletBalance?walletBalance:0}
                onChange={(e) => depositValueCheck(e)}
                prefix="$"
              />
              <button onClick={handleMaxDeposit} className="bg-amber-400 p-1 pr-3 rounded-r-full">
                MAX
              </button>
            </div>
            <p className="text-sm xl:text-lg text-amber-400">Deposit</p>
          </div>
        </div>
        <button
          className="bg-amber-400 px-2 py-1 rounded-2xl text-white mt-4 hover:scale-125 font-extrabold"
          disabled={errorMessage != ""}
        >
          {buttonValue}
        </button>
      </div>
    </div>
  );
};

export default VaultUSDCForm;
