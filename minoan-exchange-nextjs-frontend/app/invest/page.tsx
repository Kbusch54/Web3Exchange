import Image from "next/image";
import React from "react";
import AreaChartPoolsApex from "../../components/charts/poolCharts/AreaChartPoolsApex";
import CurrentTradesTable from "../../components/tables/CurrentTradesTable";
import tesla from "../../public/assets/teslaSymbol.png";
type Props = {};

const page = (props: Props) => {
  return (
    <div className="m-2">
      <div className="grid grid-cols-12">
        <div className="col-span-2 ">
          <div className="flex flex-col text-center">
            <div className="bg-slate-500 text-white text-xl">Assets</div>
            <div className="object-contain">
              <Image alt={"theseus"} src={tesla} height={520} />
            </div>
          </div>
        </div>
        <div className="col-span-7 ">
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
          <div className="flex flex-col text-center bg-slate-500 text-white m-4">
            <h3 className="text-xl">Assest</h3>
            <h3>Size</h3>
            <h3>Lev</h3>
            <h3>Side</h3>
            <h3>Collateral</h3>
          </div>
          <div className="flex flex-col text-center bg-slate-500 text-white m-4 mt-8">
            <h3>Deposit</h3>
            <h3>Withdraw</h3>
          </div>
        </div>
        <div className="my-4 col-start-2 col-span-9 border">
          <CurrentTradesTable />
        </div>
      </div>
    </div>
  );
};

export default page;
