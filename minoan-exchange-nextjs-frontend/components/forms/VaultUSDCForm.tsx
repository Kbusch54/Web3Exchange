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
  const [errorMessage, setErrorMessage] = useState("");
  const [className, setClassName] = useState("");
  const [withdrawRawValue, setWithdrawRawValue] = useState<number | null>();
  const [depositRawValue, setDepositRawValue] = useState<number | null>();
  const [withdrawDisplayValue, setWithdrawDisplayValue] = useState<string | undefined>("");
  const [depositDisplayValue, setDepositDisplayValue] = useState<string | undefined>("");
  const [buttonValue, setButtonValue] = useState<string | undefined>("Deposit");
  const [isError, setIsError] = useState(true);

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
    if (Number(rawValue)*1000000 > Number(vaultBalance)) {
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
    setWithdrawRawValue(vaultBalance);
    setWithdrawDisplayValue(rawToDisplay(vaultBalance));
    const maxWithdrawValueFormatted = parseFloat(String(vaultBalance !=null? vaultBalance/1000000:0)).toFixed(2);
    setWithdrawDisplayValue(maxWithdrawValueFormatted);
    if (withdrawRef.current) {
      withdrawRef.current.value = maxWithdrawValueFormatted;
    }
    setButtonValue("Withdraw");
    setIsError(false);
  };
  const handleFormButton = (e: React.MouseEvent<HTMLButtonElement>): void => {
    console.log("button value", buttonValue);
    console.log("deposit raw value", depositRawValue);
    console.log("withdraw raw value", withdrawRawValue);
    console.log('deposit display value', depositDisplayValue);
    console.log('withdraw display value', withdrawDisplayValue);
  };
  return (
    <div className="outside-box mt-8 ">
      <div className="flex flex-col text-center inside-box text-white ">
        <h3>USDC</h3>
        <p className="text-red-500 animate-pulse">{errorMessage}</p>
        <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between m-2">
          <div className="flex flex-col">
            <p className="input-bg">
              {rawToDisplay(vaultBalance)}
            </p>
            <p className="text-sm xl:text-lg text-amber-400">
              Available Vault Balance
            </p>
          </div>
          <div className="flex flex-col">
            <p className="input-bg">
              {rawToDisplay(walletBalance)}
            </p>
            <p className="text-sm xl:text-lg text-amber-400">Wallet Balance</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between m-2">
          <div className="flex flex-col">
            <div className={`flex flex-row justify-between input-bg ${!isError && buttonValue === "Withdraw"? 'border-2 border-green-500':className}`}>
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
            <div className={`flex flex-row justify-between input-bg ${!isError && buttonValue === "Deposit"? 'border-2 border-green-500':className}`}>
              <input
              ref={depositRef}
                type="number"
                className={`text-slate-600 w-32 lg:w-24 xl-w-32  rounded-l-full text-center ${className} `}
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
            <p className="text-sm xl:text-lg text-amber-400">Deposit</p>
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
  );
};

export default VaultUSDCForm;
