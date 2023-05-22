import Image from "next/image";
import React from "react";
import AreaChartPoolsApex from "../../../components/charts/poolCharts/AreaChartPoolsApex";
import InvestForm from "../../../components/forms/InvestForm";
import VaultUSDCForm from "../../../components/forms/VaultUSDCForm";
import StockOptionMenu from "../../../components/menus/StockOptionMenu";
import FFRData from "../../../components/stockData/FFRData";
import InterestData from "../../../components/stockData/InterestData";
import InvestorStats from "../../../components/stockData/InvestorStats";
import StockData from "../../../components/stockData/StockData";
import CurrentTradesTable from "../../../components/tables/CurrentTradesTable";
import GlobalTrades from "../../../components/tables/GlobalTrades";
import { Stock } from "../../../types/custom";
import { stocks } from "../../utils/stockData";
import ReachartsEx from "../../../components/charts/poolCharts/ReachartsEx";
import { getServerSession } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
type Props = {};
async function fetchData(slug: string) {
  // Fetch data based on the slug value
}

const getStocks = async (slug: string) => {
  const s: Stock | undefined = stocks.find(
    (stock: { symbol: string; }) => stock.symbol.toUpperCase() === String(slug).toUpperCase()
  );
  return s;
};
export default async function page(context: { params: { slug: string; }; }) {
  const session = await getServerSession();
  const slug = context.params.slug ?? 'tsla'; // Set the default slug value to 'tsla'
  if(!session) {
      redirect(`/auth/signin?callbackUrl=/invest/${slug}`);
  }
  const data = await fetchData(slug);
  const stock = await getStocks(slug);
  return (
    <div className="m-2">
      {stocks && (
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-2 ">
            <div className="flex flex-col text-center justify-center">
              {stock && (
                <StockOptionMenu stockData={stocks} />
              )}
              {stock && (
                <div className="object-contain  self-center">
                  <Image src={stock.img}
                    alt={"stock-img"} height={520} />
                  <div className="text-3xl text-white">{slug}</div>
                </div>
              )}
            </div>


          </div>

          <div className="hidden lg:block lg:col-span-7 mr-8 ">
            <div className="grid grid-rows-6 ">
              <div className="row-span-4">
                <AreaChartPoolsApex />
              </div>
              <div className="row-span-2">
                <ReachartsEx />
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <InvestForm />
            <VaultUSDCForm />
          </div>
          <div className="col-span-12 flex flex-col lg:flex-row items-center justify-evenly gap-y-8 mt-8">

            {stock?.symbol && (
              <StockData stockSymbol={stock?.symbol} />
            )}

            <FFRData />
            <InterestData />
            <InvestorStats />
          </div>
          <div className="my-4 col-start-2 col-span-9 ">
            <CurrentTradesTable />
          </div>
          <div className="my-4  lg:col-start-2 lg:col-span-9 ">
            <GlobalTrades />
          </div>
        </div>
      )}
    </div>
  );
};