// components/TeslaStockInfo.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const StockInfo = () => {
  const [stockData, setStockData] = useState<any>(null);
  const [reco, setReco] = useState<String>("BUY");

  useEffect(() => {
    const fetchStockData = async () => {
      const rapidAPIKey = "e70ebb1b60mshf11976b783c2186p1cc165jsnffe0a87e55b3";
      const rapidAPIHost = "yahoo-finance15.p.rapidapi.com";
      const url = `https://${rapidAPIHost}/api/yahoo/qu/quote/TSLA/financial-data`;
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
    //   <p>
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
    <div className=" flex flex-col justify-center text-center inside-box text-white">
      <h2 className="text-xl mb-2">Yahoo Stock Info</h2>
      <p>Current Price: 284.43</p>
      <p>High Price: 370.80</p>
      <p>Low Price: 207.77</p>
      <div>
        <p>Recommendation: </p>
        <p className={`${reco == "BUY" ? "text-green-500" : "text-red-500"}`}>
          {reco}
        </p>
      </div>
    </div>
  );
};

export default StockInfo;
