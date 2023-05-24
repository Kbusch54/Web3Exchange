import { stocks } from "../../utils/stockData";
import Image from "next/image";
import { Stock } from "../../../types/custom";
import DaoTransaction from "../../../components/tables/DaoTransactions";
import PurposalModal from "../../../components/modals/PurposalModal";
import StakingForm from "../../../components/forms/StakingForm";
import Balances from "../../../components/balances/Balances";
import InvestorStats from "../../../components/stockData/InvestorStats";
import StakingStats from "../../../components/stockData/StakingStats";
import { getServerSession } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { request, gql } from 'graphql-request';
import VaultUSDCForm from "../../../components/forms/VaultUSDCForm";
import ReachartsEx from "../../../components/charts/poolCharts/ReachartsEx";
import { use } from "react";
import { useBalance } from "wagmi";

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
          stakes{
            totalStaked
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
    (stock) => stock.symbol === slug
  );
  return s;
};



export default async function PoolPage({ params }: Props) {
  const stock = await getStocks(params.slug);
  const session = await getServerSession();
  if(!session) {
    redirect(`/auth/signin?callbackUrl=/pools/${params.slug}`);
  }


  const graphData = await fetchLoanPoolData(params.slug.toLowerCase(),session.user.name);
  return (
    <div>
      {stock && graphData? (
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
              <h1>{graphData.name.toUpperCase()}</h1>
              <h3 className="text-xl">{stock.symbol}</h3>
            </div>
    
              <Balances poolBalances={graphData.loanPool.poolBalance} poolToken={graphData.loanPool.poolToken}  /> 
            <div
              id={"charts"}
              className="hidden md:block col-span-9  shadow-xl shadow-slate-500"
            >
                <ReachartsEx />
            </div>
            <div
              id={"stats"}
              className="col-span-9 lg:col-span-9 flex flex-wrap justify-evenly items-center text-center gap-y-12">
              <InvestorStats loanPool={graphData.loanPool} />
              <StakingStats stakes={graphData.loanPool.stakes} />
            </div>
            <div
              id={"staking"}
              className=" flex flex-col col-span-9 lg:col-span-9 text-center text-lg justify-center items-center "
            >
              <h1 className="my-4">Deposit and Withdraw</h1>

             <div className="">
                <VaultUSDCForm availableUsdc={graphData.loanPool.poolToken.tokenBalance[0].user.balances.availableUsdc} user={session.user.name} />
             </div>
           
            </div>
            <div
              id={"staking"}
              className="col-span-9 lg:col-span-9 text-center "
            >
              <h1 className="my-4">Stake</h1>
                <StakingForm poolToken={graphData.loanPool.poolToken} totalUSDCSupply={graphData.loanPool.poolBalance.totalUsdcSupply} />
            </div>
          </div>
          <div id={"dao"} className="m-2 md:m-12">
            <DaoTransaction />
            <PurposalModal />
          </div>
        </div>
      ):(
        <div>Loading</div>
      )}
    </div>
  );
}
