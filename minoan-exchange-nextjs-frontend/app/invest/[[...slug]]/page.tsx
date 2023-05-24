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
import {request,gql} from "graphql-request";
import GlobalTradesBox from "../../../components/tables/GlobalTradesBox";
type Props = {};
async function fetchLoanPoolData(symbol: string, user: string) {
  const query = gql`
    query getLoanPool($id: String!,$user: String!) {
      vamms(where: { symbol: $id}) {
        name
        loanPool {
          id
          created
          minLoan
          maxLoan
          interestRate
          interestPeriod
          mmr
          minHoldingsReqPercentage
          tradingFee
          poolBalance {
            totalUsdcSupply
            availableUsdc
            outstandingLoanUsdc
          }
          poolToken{
            tokenId
            totalSupply
            tokenBalance(where:{user:$user}){
              tokensOwnedbByUser
              totalStaked
              user{
                balances{
                  availableUsdc
                }
              }
            }
          }
        }
      }
    }
  `;

  

  const endpoint = process.env.NEXT_PUBLIC_API_URL ||"https://api.studio.thegraph.com/query/46803/subgraph-minoan/v0.1.3";
  const variables = { id: symbol, user: user };
  const data = await request(endpoint, query, variables);
  //@ts-ignore
  return data.vamms[0];
}

const getStocks = async (slug: string) => {
  const s: Stock | undefined = stocks.find(
    (stock: { symbol: String; }) => stock.symbol.toUpperCase() === String(slug).toUpperCase()
  );
  return s;
};
export default async function page(context: { params: { slug: string; }; }) {
  const session = await getServerSession();
  const slug = context.params.slug ?? 'tsla'; // Set the default slug value to 'tsla'
  if(!session) {
      redirect(`/auth/signin?callbackUrl=/invest/${slug}`);
  }
  const graphData = await fetchLoanPoolData(slug.toString().toLowerCase(),session.user.name);
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

          <div className=" mr-8 lg:col-span-7  ">
            <div className="grid grid-rows-6 ">
              <div className="row-span-4">
                {/* <AreaChartPoolsApex /> */}
              </div>
              <div className="row-span-2">
                <ReachartsEx />
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <InvestForm stockData={stocks} currentData={graphData}/>
            <VaultUSDCForm availableUsdc={graphData.loanPool.poolToken.tokenBalance[0]?.user? graphData.loanPool.poolToken.tokenBalance[0].user.balances.availableUsdc:0} user={session.user.name}/>
          </div>
          <div className="col-span-12 grid grid-cols-2 xl:grid-cols-4 gap-x-6 items-center justify-evenly gap-y-8  mt-8">

            {stock?.symbol && (
              <StockData stockSymbol={stock?.symbol} />
            )}

            <InterestData />
            <FFRData />
            <InvestorStats loanPool={graphData.loanPool}/>
          </div>
          <div className="my-4 col-start-2 col-span-9  w-full">
            <CurrentTradesTable />
          </div>
          <div className="my-4  lg:col-start-2 lg:col-span-9 w-full text-white ">
            {/* <GlobalTrades />
             */}
             <h1 className="text-white text-3xl text-center my-4">Recent {stock?.name.toUpperCase()  } Trades</h1>
             <GlobalTradesBox />
          </div>
        </div>
      )}
    </div>
  );
};