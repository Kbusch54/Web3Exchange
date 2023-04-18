import Image from "next/image";
import React from "react";
import AreaChartPoolsApex from "../../components/charts/poolCharts/AreaChartPoolsApex";
import VaultUSDCForm from "../../components/forms/VaultUSDCForm";
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
        <div className="col-span-12 flex flex-col md:flex-row items-center justify-evenly ">
          <div className="outside-box mt-8 row-span-3">
            <div className="asset-data-box inside-box">
              <h1>Future Funding Rate</h1>
              <div className="flex flex-row justify-between m-4 gap-x-4 text-xl">
                <p>EST FFR</p>
                <p>12.8</p>
              </div>
              <div className="flex flex-row justify-between m-4 gap-x-4 text-xl">
                <p>Next Period</p>
                <div className="flex-col">
                  <p>15:27</p>
                  <p className="text-xs text-amber-500">APROX</p>
                </div>
              </div>
              <div className="flex flex-row justify-between m-4 gap-x-4 text-xl">
                <p>Total Collateral Change</p>
                <div className="flex-col">
                  <p>+ $5.91</p>
                  <p className="text-xs text-amber-500 ml-6">TSLA</p>
                </div>
              </div>
            </div>
          </div>
          <div className="outside-box mt-8 row-span-3">
            <div className="asset-data-box inside-box ">
              <h1>Interest</h1>
              <div className="flex flex-row justify-between m-4 gap-x-4 text-xl">
                <p>Next Period</p>
                <div className="flex-col">
                  <p>29:18</p>
                  <p className="text-xs text-amber-500">APROX</p>
                </div>
              </div>
              <div className="flex flex-row justify-between m-4 gap-x-4 text-xl">
                <p>Total Collateral Change</p>
                <div className="flex-col">
                  <p>- $13.29</p>
                  <p className="text-xs text-amber-500 ml-6">TSLA</p>
                </div>
              </div>
            </div>
          </div>
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
