// components/TeslaStockInfo.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  stockSymbol: String;
}
const StockInfo: React.FC<Props> = ({ stockSymbol }) => {
  const [stockData, setStockData] = useState<any>(null);
  const [reco, setReco] = useState<String>("BUY");

  useEffect(() => {
    const fetchStockData = async () => {
      const rapidAPIKey = "e70ebb1b60mshf11976b783c2186p1cc165jsnffe0a87e55b3";
      const rapidAPIHost = "yahoo-finance15.p.rapidapi.com";
      const url = `https://${rapidAPIHost}/api/yahoo/qu/quote/${stockSymbol.toUpperCase()}/financial-data`;
      https: try {
        const response = await axios.get(url, {
          headers: {
            "X-RapidAPI-Host": rapidAPIHost,
            "X-RapidAPI-Key": rapidAPIKey,
          },
        });

        if (response.data) {
          setStockData(response.data.financialData);
          console.log(response.data.financialData);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    // fetchStockData();
  }, []);

  //   if (!stockData) {
  //     return <div>Loading...</div>;
  //   }

  return (
    // <div className="bg-blue-200">
    //   <h2>Tesla Stock Information</h2>
    //   <p className="text-xl">
    //     Current Price: {stockData.currentPrice && stockData.currentPrice.fmt}
    //   </p>
    //   <p>
    //     Target High Price:{" "}
    //     {stockData.targetHighPrice && stockData.targetHighPrice.fmt}
    //   </p>
    //   <p>
    //     Target Low Price:{" "}
    //     {stockData.targetLowPrice && stockData.targetLowPrice.fmt}
    //   </p>
    //   <p>Recommendation Mean: {stockData.recommendationKey}</p>
    // </div>
    <div className="outside-box ">
      <div className=" flex flex-col justify-center text-center inside-box text-white gap-y-2">
        <h2 className="text-3xl mb-2">Yahoo Stock Info</h2>
        <h3 className="text-amber-400">{stockSymbol}</h3>
        <div className="flex flex-row justify-between text-xl"><p>Current Price:</p><p> 284.43</p></div>
        <div className="flex flex-row justify-between text-xl"><p>High Price:</p><p> 370.80</p></div>
        <div className="flex flex-row justify-between text-xl"><p>Low Price: </p><p>207.77</p></div>



        <div className="flex flex-row justify-between text-xl">
          <p >Recommendation: </p>
          <p className={` ${reco == "BUY" ? "text-green-500" : "text-red-500"}`}>
            {reco}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockInfo;
