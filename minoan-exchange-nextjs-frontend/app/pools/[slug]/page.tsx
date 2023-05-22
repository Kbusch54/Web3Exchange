import { stocks } from "../../utils/stockData";
import Image from "next/image";
import { Stock } from "../../../types/custom";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import DaoTransaction from "../../../components/tables/DaoTransactions";
import PurposalModal from "../../../components/modals/PurposalModal";
import StakingForm from "../../../components/forms/StakingForm";
import Balances from "../../../components/balances/Balances";
import InvestorStats from "../../../components/stockData/InvestorStats";
import StakingStats from "../../../components/stockData/StakingStats";
import { getServerSession } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { request, gql } from 'graphql-request';

interface Props {
  params: {
    slug: string;
  };
}


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

  

  const endpoint = process.env.NEXT_PUBLIC_API_URL ||"https://api.studio.thegraph.com/query/46803/subgraph-minoan/v0.1.1";
  const variables = { id: symbol, user: user };
  const data = await request(endpoint, query, variables);
  //@ts-ignore
  return data.vamms[0];
}

async function fetchTokenBalances(id: string, user: string) {
  const query = gql`
    query getLoanPool($id: String!, $user: String!) {
      {
        poolToken(id: $id) {
        
        tokenId
        totalSupply
        tokenBalance(where:{user:$user}){
          
          totalStaked
          tokensOwnedbByUser
          token {
            isFrozen
          }
        }
        
      }
    }
    }
  `;

  const endpoint = 'https://api.studio.thegraph.com/query/46803/subgraph-minoan/v0.1.1';
  const variables = { id: id, user: user };
  const data = await request(endpoint, query, variables);
  //@ts-ignore
  return data;
}

const getStocks = async (slug: string) => {
  const s: Stock | undefined = stocks.find(
    (stock) => stock.symbol === slug
  );
  return s;
};

const AreaChartsForPools = dynamic(
  () => import("../../../components/charts/poolCharts/AreaChartPoolsApex"),
  { ssr: false }
);

export default async function PoolPage({ params }: Props) {
  const stock = await getStocks(params.slug);
  const session = await getServerSession();
  if(!session) {
    redirect(`/auth/signin?callbackUrl=/pools/${params.slug}`);
  }
  const graphData = await fetchLoanPoolData(params.slug.toLowerCase(),session.user.name);
  // console.log(graphData);
  
  // console.log('amm',graphData.loanPool.id);
  // const tokenBal = await fetchTokenBalances(String(loanPool.loanPool.id),String(session.user.name));
  // console.log('this is tokenBal',tokenBal);
  // console.log('user',session.user.name);
  // console.log('poolabalce',graphData.loanPool.poolToken.tokenBalance[0]);
  return (
    <div>
      {stock && (
        <div className="text-center">
          <div className="grid m-12 text-white text-5xl grid-cols-3 lg:grid-cols-9 gap-y-12 ">
            <div className="col-span-3 md:col-span-2">
              <Image
                src={stock.img}
                alt={"stock-img"}
                width={250}
                height={250}
              />
            </div>
            <div className="col-span-1 flex flex-col gap-y-24 text-center">
              <h1>{graphData.name}</h1>
              <h3 className="text-xl">{stock.symbol}</h3>
            </div>
    
              <Balances poolBalances={graphData.loanPool.poolBalance} poolToken={graphData.loanPool.poolToken}  /> 
            <section
              id={"charts"}
              className="hidden md:block col-span-9  shadow-xl shadow-slate-500"
            >
              <Suspense
                fallback={
                  <div className="text-white text-3xl">Loading feed...</div>
                }
              >
                <AreaChartsForPools />
              </Suspense>
            </section>
            <section
              id={"stats"}
              className="col-span-9 lg:col-span-9 flex flex-wrap justify-evenly items-center text-center gap-y-12"
            >
              <InvestorStats loanPool={graphData.loanPool} />
              <StakingStats />
            </section>
            <section
              id={"staking"}
              className="col-span-9 lg:col-span-9 text-center "
            >
              <h1 className="my-4">Stake</h1>

              <div className="">
                <StakingForm />
              </div>
            </section>
          </div>
          <section id={"dao"} className="m-2 md:m-12">
            <DaoTransaction />
            <PurposalModal />
          </section>
        </div>
      )}
    </div>
  );
}
