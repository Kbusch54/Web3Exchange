"use client";
import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";

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
      setClassName("border-8 border-green-500 ");
      setErrorMessage("");
      setEstToken(calcTokenAmt(Number(rawValue) * 1000000, 2000000000, 90828));
    }
  };

  return (
    <form className="needs-validation">
      <div className="row">
        <div className="col">
          <label htmlFor="px-2">Please enter a value:</label>
          <CurrencyInput
            id="field"
            max={"99.00"}
            placeholder="$0.00"
            allowDecimals={true}
            className={`text-black ${className} `}
            onValueChange={validateValue}
            prefix={"$"}
          />
          <div className="invalid-feedback">{errorMessage}</div>
        </div>

        <div className="text-muted mr-3">onValueChange:</div>
        <div>{rawValue}</div>
        <div>Estimated token amount to get</div>
        <div>{estToken}</div>
      </div>
    </form>
  );
}
