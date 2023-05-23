"use client";
import React, {  useEffect, useRef, useState } from "react";
import { Address, useBalance } from "wagmi";
import { useSession } from "next-auth/react";
import Swiper from 'swiper';
interface Props {
  availableUsdc: number;
  user: Address;
 }
//fetch data from acount data and vaultBalances then pass it to the form revalidating every 30 seconds

const VaultUSDCForm: React.FC<Props> = ({availableUsdc,user}) => {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const depositRef = useRef<HTMLInputElement>(null);
  const withdrawRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [className, setClassName] = useState("");
  const [withdrawRawValue, setWithdrawRawValue] = useState<number | null>();
  const [depositRawValue, setDepositRawValue] = useState<number | null>();
  const [withdrawDisplayValue, setWithdrawDisplayValue] = useState<string | undefined>("");
  const [depositDisplayValue, setDepositDisplayValue] = useState<string | undefined>("");
  const [buttonValue, setButtonValue] = useState<string | undefined>("Deposit");
  const [isError, setIsError] = useState(true);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
    return () => {
      setDomLoaded(false);
    };
  }, []);


  function rawToDisplay(value: number | null) {
    if (value === undefined) {
      return "$0.00";
    } else {
      return "$" + (Number(value) / 1000000).toFixed(2);
    }
  }

  const {data,isLoading,error} = useBalance({
    address: user,
    token: '0xAADbde5D0ED979b0a88770be054017fC40Bc43d1',
 
  });

  useEffect(() => {
    if(data?.value) setWalletBalance((prevState) =>prevState = data.value.toNumber());
  }, [data]);

  const handleDepositFocus = (e: React.ChangeEvent<HTMLInputElement>): void => {
    /* @ts-ignore */
    withdrawRef.current.value = "$0.00";
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
      setIsError(true);
    } else {
      validateValue(rawValue);
      setButtonValue("Deposit");
    }
  };
  const withdrawValueCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {

    const rawValue = e.target.value === null ? 0 : Number(e.target.value);
    setWithdrawRawValue(Number(rawValue) * 1000000 || 0);
    setWithdrawDisplayValue(rawToDisplay(rawValue*1000000));
    if (Number(rawValue)*1000000 > Number(availableUsdc)) {
      setErrorMessage(
        "Value you entered is more USDC than available in the vault"
      );
      setClassName("border border-red-500 bg-red-500");
      setIsError(true);
    } else {
      validateValue(rawValue);
      setButtonValue("Withdraw");
      
    }
  };

  const validateValue = (value: number | undefined): void => {
    if (!value) {
      setClassName("");
      setIsError(true);
    } else if (Number.isNaN(Number(value))) {
      setErrorMessage("Please enter a valid number");
      setClassName("border border-red-500 bg-red-500");
      setIsError(true);
    }else if(Number(value)<=0){
      setErrorMessage("Please enter a value greater than 0");
      setClassName("border border-red-500 bg-red-500");
      setIsError(true);
    } else {
      setClassName("border-2 border-green-500 ");
      setErrorMessage("");
      setIsError(false);
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
    setIsError(false);
  };
  const handleMaxWithdraw = (e: React.MouseEvent<HTMLButtonElement>): void => {
    //@ts-ignore
    handleWithdrawFocus(e);
    setWithdrawRawValue(availableUsdc);
    setWithdrawDisplayValue(rawToDisplay(availableUsdc));
    const maxWithdrawValueFormatted = parseFloat(String(availableUsdc !=null? availableUsdc/1000000:0)).toFixed(2);
    setWithdrawDisplayValue(maxWithdrawValueFormatted);
    if (withdrawRef.current) {
      withdrawRef.current.value = maxWithdrawValueFormatted;
    }
    setButtonValue("Withdraw");
    setIsError(false);
  };
  const handleFormButton = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    console.log("button value", buttonValue);
    console.log("deposit raw value", depositRawValue);
    console.log("withdraw raw value", withdrawRawValue);
    console.log('deposit display value', depositDisplayValue);
    console.log('withdraw display value', withdrawDisplayValue);
  };
  if(isLoading) return <div>Fetching dtaa</div>
  if(error) return <div>Something went wrong</div>
  
  return (
    <>
    {domLoaded && (
    <div className="outside-box mt-8 ">
      <div className="flex flex-col text-center inside-box text-white ">
        <h3>USDC</h3>
        <p className="text-red-500 animate-pulse">{errorMessage}</p>
        <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between m-2">
          <div className="flex flex-col">
            <p className="bg-white rounded-full text-slate-600 text-center  tracking-wide md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem]">
              {rawToDisplay(availableUsdc)}
            </p>
            <p className="text-sm xl:text-md text-amber-400">
              Available Vault Balance
            </p>
          </div>
          <div className="flex flex-col">
            <p className="bg-white rounded-full text-slate-600 text-center  tracking-wide md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem]">
              {rawToDisplay(walletBalance)}
            </p>
            <p className="text-sm xl:text-md text-amber-400">Wallet Balance</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between m-2">
          <div className="flex flex-col">
            <div className={`flex flex-row justify-between bg-white rounded-full text-slate-600 text-center  tracking-wide md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem] ${!isError && buttonValue === "Withdraw"? 'border-2 border-green-500':className}`}>
              <input
                type="number"
                ref={withdrawRef}
                className={`text-slate-600 w-full text-md md:text-sm lg:text-lg rounded-l-full text-center pl-2 ${className} `}
                onFocus={handleWithdrawFocus}
                max={availableUsdc?availableUsdc:0}
                step="0.01"
                placeholder="$0.00"
                prefix="$"
                onChange={(e) => withdrawValueCheck(e)}
              />
              <button onClick={handleMaxWithdraw} className="bg-amber-400  p-1 pr-3 rounded-r-full ">
                MAX
              </button>
            </div>
            <p className="text-sm xl:text-md text-amber-400">Withdraw</p>
          </div>
          <div className="flex flex-col">
            <div className={`flex flex-row justify-between bg-white rounded-full text-slate-600 text-center  tracking-wide md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem] ${!isError && buttonValue === "Deposit"? 'border-2 border-green-500':className}`}>
              <input
              ref={depositRef}
                type="number"
                className={`text-slate-600 w-full text-md md:text-sm lg:text-lg rounded-l-full text-center pl-2 ${className} `}
                onFocus={handleDepositFocus}
                step="0.01"
                placeholder="$0.00"
                max={walletBalance?walletBalance:0}
                onChange={(e) => depositValueCheck(e)}
                prefix={"$"}

              />
              <button onClick={handleMaxDeposit} className="bg-amber-400 p-1 pr-3 rounded-r-full">
                MAX
              </button>
            </div>
            <p className="text-sm xl:text-md text-amber-400">Deposit</p>
          </div>
        </div>
        <button
          className={` px-2 py-1 rounded-2xl text-white mt-4 font-extrabold ${isError? 'bg-slate-700':"bg-amber-400 hover:scale-125"} `}
          disabled={isError} onClick={handleFormButton}
        >
          {buttonValue}
        </button>
      </div>
    </div>
    )}
    </>
  );
};

export default VaultUSDCForm;
