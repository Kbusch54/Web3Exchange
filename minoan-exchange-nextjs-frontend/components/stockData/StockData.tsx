
"use client";
import React, { cache, useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { moneyFormatter } from "utils/helpers/functions";

interface Props {
  stockSymbol: String;
  priceData?: any;
  stockPriceData?: any;
}
const StockInfo: React.FC<Props> = ({ stockSymbol, priceData, stockPriceData }) => {

const markPrice = priceData && priceData[priceData.length - 1]?  priceData[priceData.length - 1].isFrozen == false? priceData[priceData.length - 1].marketPrice : stockPriceData.Results[stockPriceData.Results.length-1].Close *10**6:0;


  if (!stockPriceData && !priceData) {
    return <div className="text-white animate-pulse">Loading...</div>;
  }
  return (
    <div className="outside-box ">
      <div className=" flex flex-col justify-center text-center inside-box text-white gap-y-2">
        {stockPriceData && (
          <>
            <h2 className="text-3xl mb-2">Yahoo Stock Info</h2>
            <h3 className="text-amber-400">{stockSymbol}</h3>
            <div className="flex flex-row justify-between text-xl"><p>Current Price:</p><p>${Number(stockPriceData.Results[stockPriceData.Results.length-1].Close).toFixed(2)}</p></div>
            <div className="flex flex-row justify-between text-xl"><p>High Price:</p><p>${stockPriceData.Results[stockPriceData.Results.length-2].High}</p></div>
            <div className="flex flex-row justify-between text-xl"><p>Low Price:</p><p>${stockPriceData.Results[stockPriceData.Results.length-2].Low}</p></div>
            <div className="flex flex-row justify-between text-xl"><p>Last Price:</p><p>${stockPriceData.Results[stockPriceData.Results.length-2].Close}</p></div>
              <div className="flex flex-row justify-between text-xl"><p>Market Price:</p> <p>${moneyFormatter(markPrice)}</p></div>
            <div className="flex flex-row justify-between text-xl">
              <p >Recommendation: </p>
              {/* <p className={` ${stockData.recommendationKey.toLowerCase().includes("buy") ? "text-green-500" : stockData.recommendationKey == 'hold' ? 'text-yellow-400' : "text-red-500"}`}>
                {stockData.recommendationKey.toUpperCase().replace("_", " ")}
              </p> */}
            </div>
          </>
        )}
  
   
      </div>
    </div>
  );
};

export default StockInfo;
