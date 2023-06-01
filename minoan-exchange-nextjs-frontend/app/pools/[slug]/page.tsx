import { stocks } from "../../utils/stockData";
import Image from "next/image";
import { Stock } from "../../../types/custom";
import PurposalModal from "../../../components/modals/ProposalModal";
import Balances from "../../../components/balances/Balances";
import InvestorStats from "../../../components/stockData/InvestorStats";
import StakingStats from "../../../components/stockData/StakingStats";
import { getServerSession } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { request, gql } from 'graphql-request';
import VaultUSDCForm from "../../../components/forms/VaultUSDCForm";
import ReachartsEx from "../../../components/charts/poolCharts/ReachartsEx";
import StakingSection from "../../../components/forms/StakingSection";
import DAOPurposals from "../../../components/tables/daos/DAOPurposals";

interface Props {
  params: {
    slug: string;
  };
}
interface GraphData {
  vamms: {
    name: string;
    loanPool: {
      id: string;
      created: string;
      minLoan: string;
      maxLoan: string;
      interestRate: string;
      interestPeriod: string;
      mmr: string;
      minHoldingsReqPercentage: string;
      tradingFee: string;
      poolBalance: {
        totalUsdcSupply: string;
        availableUsdc: string;
        outstandingLoanUsdc: string;
      };
      stakes: {
        totalStaked: string;
      };
      poolToken: {

        tokenId: string;
        totalSupply: string;
        tokenBalance: {
          tokensOwnedbByUser: string;
          totalStaked: string;
          user: {
            balances: {
              availableUsdc: string;
            };
          };
        };
      };
    };
  };
  users: {
    id: string;
    balances: {
      availableUsdc: string;
    };
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
            ammPool{
              ariadneDAO{
                id
                votesNeededPercentage
                votingTime
                poolToken{
                totalSupply
                tokenBalance(where:{user:$user}) {
                    tokensOwnedbByUser
                    }
                }
              }
            }
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
          loanPoolTheseus{
            minMMR
            maxMMR
            minInterestRate
            maxInterestRate
            minTradingFee
            maxInterestPeriod
            minInterestPeriod
            minHoldingsReqPercentage
            maxHoldingsReqPercentage
            maxTradingFee
            minLoan
            maxLoan
          }
        }
      }
      users(where:{id:$user}){
        id
        balances{
          availableUsdc
        }
      }
      }
  `;



  const endpoint = process.env.NEXT_PUBLIC_API_URL || "https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
  const variables = { id: symbol, user: user };
  const data = await request(endpoint, query, variables);

  return data;
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
  if (!session) {
    redirect(`/auth/signin?callbackUrl=/pools/${params.slug}`);
  }



  const allData = await fetchLoanPoolData(params.slug.toLowerCase(), session.user.name);
  //@ts-ignore
  const graphData = allData.vamms[0];
    //@ts-ignore
    const poolToken=graphData.loanPool.poolToken;
  //@ts-ignore
  const userData = allData.users[0].balances.availableUsdc;
  //@ts-ignore
  const ariadneData = allData.vamms[0].loanPool.poolToken.ammPool.ariadneDAO;
  return (
    <div>
      {stock && graphData ? (
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

            <Balances poolBalances={graphData.loanPool.poolBalance} poolToken={graphData.loanPool.poolToken} />
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
                  <VaultUSDCForm availableUsdc={userData} user={session.user.name} />
              </div>

            </div>
            <StakingSection availableUsdc={userData} poolToken={graphData.loanPool.poolToken} user={session.user.name} name={stock.name} poolBalance={graphData.loanPool.poolBalance} />
          </div>
          <div id={"dao"} className="m-2 md:m-12">
            <DAOPurposals isTheseus={false} user={session.user.name} daoAddress={poolToken.ammPool.ariadneDAO.id} tokenId={poolToken.tokenId} />
            {/* <DaoTransaction /> */}
            <PurposalModal ariadneData={ariadneData} loanPoolTheseus={graphData.loanPool.loanPoolTheseus} symbol={stock.symbol} ammAddress={graphData.loanPool.id} currentValue={graphData.loanPool} user={session.user.name} />
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}
