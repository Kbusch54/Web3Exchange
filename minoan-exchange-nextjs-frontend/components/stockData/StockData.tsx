
"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";

interface Props {
  stockSymbol: String;
}
const StockInfo: React.FC<Props> = ({ stockSymbol }) => {
  const [stockData, setStockData] = useState<any>(null);

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
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };
  useLayoutEffect(() => {

    if(stockData){
    //interval for 5 minutes
    setInterval(() => {
      fetchStockData();
    }, 300000);
  }
  else{
    fetchStockData();
  }
    // fetchStockData();
  }, []);

    if (!stockData) {
      return <div>Loading...</div>;
    }
  return (
    <div className="outside-box ">
      <div className=" flex flex-col justify-center text-center inside-box text-white gap-y-2">
        <h2 className="text-3xl mb-2">Yahoo Stock Info</h2>
        <h3 className="text-amber-400">{stockSymbol}</h3>
        <div className="flex flex-row justify-between text-xl"><p>Current Price:</p><p> {stockData.currentPrice && stockData.currentPrice.fmt}</p></div>
        <div className="flex flex-row justify-between text-xl"><p>High Price:</p><p> {stockData.targetHighPrice && stockData.targetHighPrice.fmt}</p></div>
        <div className="flex flex-row justify-between text-xl"><p>Low Price: </p><p>{stockData.targetLowPrice && stockData.targetLowPrice.fmt}</p></div>



        <div className="flex flex-row justify-between text-xl">
          <p >Recommendation: </p>
          <p className={` ${stockData.recommendationKey.toLowerCase().includes("buy") ? "text-green-500": stockData.recommendationKey == 'hold'? 'text-yellow-400' : "text-red-500"}`}>
          {stockData.recommendationKey.toUpperCase().replace("_", " ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockInfo;
