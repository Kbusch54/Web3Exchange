import Image from "next/image";
import React from "react";
import AreaChartPoolsApex from "../../components/charts/poolCharts/AreaChartPoolsApex";
import InvestForm from "../../components/forms/InvestForm";
import VaultUSDCForm from "../../components/forms/VaultUSDCForm";
import FFRData from "../../components/stockData/FFRData";
import InterestData from "../../components/stockData/InterestData";
import StockData from "../../components/stockData/StockData";
import CurrentTradesTable from "../../components/tables/CurrentTradesTable";
import GlobalTrades from "../../components/tables/GlobalTrades";
import tesla from "../../public/assets/teslaSymbol.png";
type Props = {};

const page = (props: Props) => {
  return (
    <div className="m-2">
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-2 ">
          <div className="flex flex-col text-center justify-center">
            <div className="bg-slate-500 text-white text-xl">Assets</div>
            <div className="object-contain ml-8 md:ml-0">
              <Image alt={"stockSymbol"} src={tesla} height={520} />
            </div>
          </div>
          <div className="outside-box mt-8">
            <StockData />
          </div>
        </div>
        
        <div className="hidden lg:block lg:col-span-7 ">
          <div className="grid grid-rows-6">
            <div className="row-span-3">
              <AreaChartPoolsApex />
            </div>
            <div className="row-span-3">
              <AreaChartPoolsApex />
            </div>
          </div>
        </div>
        
        <div className="col-span-3">
          <InvestForm/>
          <VaultUSDCForm/>
        </div>
        <div className="col-span-12 flex flex-col md:flex-row items-center justify-evenly ">
          <FFRData/>
          <InterestData/>
        </div>
        <div className="my-4 col-start-2 col-span-9 ">
          <CurrentTradesTable />
        </div>
        <div className="my-4 col-start-2 col-span-9 ">
          <GlobalTrades/>
        </div>
      </div>
    </div>
  );
};

export default page;
