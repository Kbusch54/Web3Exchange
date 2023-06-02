"use client";
import React, { useEffect, useRef, useState } from "react";
import { Address, useBalance } from "wagmi";
import { useGetAllowance } from "../../utils/contractReads/usdc/allowance";
import WithdrawButton from "./buttons/exchangeBalance/WithdrawButton";
import ApproveButton from "./buttons/exchangeBalance/ApproveButton";
import DepositButton from "./buttons/exchangeBalance/DepositButton";
interface Props {
  availableUsdc: number;
  user: Address;
}
//fetch data from acount data and vaultBalances then pass it to the form revalidating every 30 seconds

const VaultUSDCForm: React.FC<Props> = ({ availableUsdc, user }) => {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [allowanceAmt, setAllowanceAmt] = useState<number>(0);
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

  const { data, isLoading, error } = useBalance({
    address: user,
    token: '0xAADbde5D0ED979b0a88770be054017fC40Bc43d1',
    watch: true,
  });
  const { allowance, isPending } = useGetAllowance(user);

  useEffect(() => {
    if (data?.value) setWalletBalance((prevState) => prevState = data.value.toNumber());
    if (allowance) setAllowanceAmt((prevState) => prevState = Number(allowance));
  }, [data, allowance]);

useEffect(() => {
},[isPending,isLoading])
  if (isLoading || isPending) return <div>loading</div>
  if (error || !allowance) return <div>Something went wrong</div>

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
    setDepositDisplayValue(rawToDisplay(rawValue * 1000000));
    if (allowanceAmt < Number(rawValue) * 10 ** 6) {
      setButtonValue("Approve");
      setErrorMessage("");
      console.log("deposit value check: set to approve");
      setClassName("border border-amber-500 bg-amber-500");
      setIsError(false);
    }
    else if (Number(rawValue) * 1000000 > Number(walletBalance) && allowanceAmt < Number(rawValue) * 1000000) {
      setErrorMessage("Value you entered is more USDC than you own");
      setClassName("border border-red-500 bg-red-500");
      console.log("deposit value check: wallet balance less than deposit value");
      setIsError(true);
    } else {
      validateValue(rawValue);
      setButtonValue("Deposit");
      console.log("deposit value check: deposit ready");
      setClassName('')
      setIsError(false);
    }
  };
  const withdrawValueCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {

    const rawValue = e.target.value === null ? 0 : Number(e.target.value);
    setWithdrawRawValue(Number(rawValue) * 1000000 || 0);
    setWithdrawDisplayValue(rawToDisplay(rawValue * 1000000));
    if (Number(rawValue) * 1000000 > Number(availableUsdc)) {
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
    } else if (Number(value) <= 0) {
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
    const maxDepositValueFormatted = parseFloat(String(walletBalance != null ? walletBalance / 1000000 : 0)).toFixed(2);
    setDepositDisplayValue(maxDepositValueFormatted);
    if (depositRef.current) {
      depositRef.current.value = maxDepositValueFormatted;

      if (allowanceAmt < Number(walletBalance)) {
        setButtonValue("Approve");
        setErrorMessage("");
        setClassName("border border-amber-500 bg-amber-500");
        setIsError(false);
      } else {

        setButtonValue("Deposit");
        setClassName('')
        setErrorMessage("");
        setIsError(false);
      }
    }
  };
  const handleMaxWithdraw = (e: React.MouseEvent<HTMLButtonElement>): void => {
    //@ts-ignore
    handleWithdrawFocus(e);
    setWithdrawRawValue(availableUsdc);
    setWithdrawDisplayValue(rawToDisplay(availableUsdc));
    const maxWithdrawValueFormatted = parseFloat(String(availableUsdc != null ? availableUsdc / 1000000 : 0)).toFixed(2);
    setWithdrawDisplayValue(maxWithdrawValueFormatted);
    if (withdrawRef.current) {
      withdrawRef.current.value = maxWithdrawValueFormatted;

      if (availableUsdc == 0) {
        setErrorMessage("You have no USDC to withdraw");
        setClassName("border border-red-500 bg-red-500");
        setIsError(true);
      } else {
        setButtonValue("Withdraw");
        setIsError(false);
      }
    }
  };


  return (
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
                <div className={`flex flex-row justify-between bg-white rounded-full text-slate-600 text-center  tracking-wide md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem] ${!isError && buttonValue === "Withdraw" ? 'border-2 border-green-500' : className}`}>
                  <input
                    type="number"
                    ref={withdrawRef}
                    className={`text-slate-600 w-full text-md md:text-sm lg:text-lg rounded-l-full text-center pl-2 ${className} `}
                    onFocus={handleWithdrawFocus}
                    max={availableUsdc ? availableUsdc : 0}
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
                <div className={`flex flex-row justify-between bg-white rounded-full text-slate-600 text-center  tracking-wide md:w-[18rem] lg:w-[11rem] xl:w-[8rem] 2xl:w-[12.5rem] md:h-[2rem] ${!isError && buttonValue === "Deposit" ? 'border-2 border-green-500' : className}`}>
                  <input
                    ref={depositRef}
                    type="number"
                    className={`text-slate-600 w-full text-md md:text-sm lg:text-lg rounded-l-full text-center pl-2 ${className} `}
                    onFocus={handleDepositFocus}
                    step="0.01"
                    placeholder="$0.00"
                    max={walletBalance ? walletBalance : 0}
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
            

            {
              buttonValue === "Withdraw"&& withdrawRawValue&& (
                <WithdrawButton value={withdrawRawValue} user={user} disabled={isError} />
              )}
            {buttonValue === "Deposit" && depositRawValue && (
              <DepositButton value={depositRawValue} user={user} disabled={isError}/>
            )}
            {buttonValue === "Approve" && depositRawValue && (
              <ApproveButton value={depositRawValue} user={user} disabled={isError} />
            )}
            {!withdrawRawValue && !depositRawValue && (
              <button className={'px-2 py-1 rounded-2xl text-white mt-4 font-extrabold bg-slate-700 '} disabled>Deposit </button>
    
               )}
          </div>
        </div>
  );
};

export default VaultUSDCForm;
