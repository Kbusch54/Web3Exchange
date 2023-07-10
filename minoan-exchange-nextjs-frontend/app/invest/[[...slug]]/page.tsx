import Image from "next/image";
import React, { Suspense } from "react";
import InvestForm from "../../../components/forms/InvestForm";
import VaultUSDCForm from "../../../components/forms/VaultUSDCForm";
import StockOptionMenu from "../../../components/menus/StockOptionMenu";
import FFRData from "../../../components/stockData/FFRData";
import InterestData from "../../../components/stockData/InterestData";
import InvestorStats from "../../../components/stockData/InvestorStats";
import StockData from "../../../components/stockData/StockData";
import { Stock } from "../../../types/custom";
import { stocks } from "../../utils/stockData";
import ReachartsEx from "../../../components/charts/poolCharts/ReachartsEx";
import { redirect } from "next/navigation";
import AllTrades from "../../../components/tables/trades/AllTrades";
import { authOptions } from '../../../utils/auth/authOptions';
import { getServerSession } from 'next-auth/next';
import { Address } from "viem";
import PriceData from "components/stockData/charts/PriceData";
import { fetchStockData } from "app/lib/api/fetchStockData";
import { fetchLoanPoolData } from "app/lib/graph/loanPoolData";
type Props = {};
export const revalidate = 8000


const getStocks = async (slug: string) => {
  const s: Stock | undefined = stocks.find(
    (stock: { symbol: string; }) => stock.symbol.toUpperCase() === String(slug).toUpperCase()
  );
  return s;
};
export default async function page(context: { params: { slug: string; }; }) {

  const slug = context.params.slug ?? 'tsla'; // Set the default slug value to 'tsla'

  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.name) {
    return redirect(`/auth/signin?callbackUrl=/invest/${slug}`);
  }

  const user = session.user.name as Address;
  //@ts-ignore
  const loanPoolData = await fetchLoanPoolData(slug.toString().toLowerCase(), user).then((res) => {
    return res;
  });
  const stockPriceData = await fetchStockData(slug[0].toUpperCase());
  //@ts-ignore
  const graphData = loanPoolData.vamms[0];
  //@ts-ignore
  const userData = loanPoolData.users[0] ? loanPoolData.users[0].balances.availableUsdc : 0;
  const stock = await getStocks(slug);
  // @ts-ignore
  const priceData = loanPoolData.vamms[0].priceData;
  return (
    <>
      <div className="my-2 mx-6">
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
                {stock?.symbol && (
                  <div className="hidden 2xl:inline">
                    <StockData stockSymbol={stock?.symbol} priceData={priceData} stockPriceData={stockPriceData} />
                  </div>
                )}
              </div>
            </div>
            <div className=" mr-8 lg:col-span-7  ">
              <div className="grid grid-rows-6 ">
                <PriceData priceData={priceData} stockPriceData={stockPriceData} />
                <div className="row-span-2">
                  <ReachartsEx height={200} />
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <InvestForm stockData={stocks} currentData={graphData} user={user} availableUsdc={userData} />
              <VaultUSDCForm availableUsdc={graphData.loanPool.poolToken.tokenBalance[0]?.user ? graphData.loanPool.poolToken.tokenBalance[0].user.balances.availableUsdc : 0} user={user} />
            </div>
            <div className="col-span-12 grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-3 gap-x-6 items-center justify-evenly gap-y-8  mt-8">

              <div className="inline 2xl:hidden ">
                {stock?.symbol && (
                  <StockData stockSymbol={stock?.symbol} priceData={priceData} stockPriceData={stockPriceData} />
                )}
              </div>

              <InterestData user={user} amm={graphData.loanPool.id} symbol={slug} />
              <FFRData />
              <InvestorStats loanPool={graphData.loanPool} />
            </div>
            <div className="my-4 col-start-2 col-span-9  w-full">
              <Suspense fallback={<div>Loading...</div>}>

                <AllTrades user={user} userAvailableBalance={userData} active={true} global={false} amm={slug} />
              </Suspense>
            </div>
            <div className="my-4  lg:col-start-2 lg:col-span-9 w-full text-white ">
              <h1 className="text-white text-3xl text-center my-4">Recent {stock?.name.toUpperCase()} Trades</h1>
              <Suspense fallback={<div>Loading...</div>}>

                <AllTrades user={user} userAvailableBalance={userData} active={true} global={true} amm={slug} />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
