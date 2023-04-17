import Image from "next/image";
import React from "react";
import AreaChartPoolsApex from "../../components/charts/poolCharts/AreaChartPoolsApex";
import VaultUSDCForm from "../../components/forms/VaultUSDCForm";
import StockData from "../../components/stockData/StockData";
import CurrentTradesTable from "../../components/tables/CurrentTradesTable";
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
          <div className="outside-box mt-4">
            <div className="flex flex-col text-center inside-box text-white">
              <div className="flex flex-row justify-between m-2 ">
                <h3 className="text-xl">Assest</h3>
                <input type="text" className="rounded-xl w-32 ml-2 " />
              </div>
              <div className="flex flex-row justify-between m-2">
                <h3>Size</h3>
                <input type="text" className="rounded-xl w-32 ml-2 " />
              </div>
              <div className="flex flex-row justify-between m-2">
                <h3>Lev</h3>
                <input type="text" className="rounded-xl w-32 ml-2 " />
              </div>
              <div className="flex flex-row justify-between m-2">
                <h3>Side</h3>
                <input type="text" className="rounded-xl w-32 ml-2 " />
              </div>
              <div className="flex flex-row justify-between m-2">
                <h3>Collateral</h3>
                <input type="text" className="rounded-xl w-32 ml-2 " />
              </div>
              <button className="bg-amber-400 px-2 py-1 rounded-2xl text-white mt-4 hover:scale-125">
                TRADE
              </button>
            </div>
          </div>
          <VaultUSDCForm/>
        </div>
        <div className="my-4 col-start-2 col-span-9 border">
          <CurrentTradesTable />
        </div>
      </div>
    </div>
  );
};

export default page;
