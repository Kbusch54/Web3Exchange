import { stocks } from "../../utils/stockData";
import Image from "next/image";
import { Stock } from "../../../types/custom";
import PurposalModal from "../../../components/modals/proposal/ProposalModal";
import Balances from "../../../components/balances/Balances";
import InvestorStats from "../../../components/stockData/InvestorStats";
import StakingStats from "../../../components/stockData/StakingStats";
import { redirect } from "next/navigation";
import VaultUSDCForm from "../../../components/forms/VaultUSDCForm";
import StakingSection from "../../../components/forms/StakingSection";
import DAOPurposals from "../../../components/tables/daos/DAOPurposals";
import { authOptions } from '../../../utils/auth/authOptions';
import { getServerSession } from 'next-auth/next';
import { Address } from "viem";
import TypeSelection from "../../../components/menus/TypeSelection";
import { fetchLoanPoolData } from "app/lib/graph/poolsData";
import PriceData from "components/stockData/charts/PriceData";
import { fetchStockData } from "app/lib/api/fetchStockData";

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





const getStocks = async (slug: string) => {
  const s: Stock | undefined = stocks.find(
    (stock) => stock.symbol === slug
  );
  return s;
};



export default async function PoolPage({ params }: Props) {
  const stock = await getStocks(params.slug);

  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.name) {
    redirect(`/auth/signin?callbackUrl=/pools/${params.slug}`);
  }


  const user = session.user.name as Address;
 
  const allData = await fetchLoanPoolData(params.slug.toLowerCase(), session.user.name);
  //@ts-ignore
  const graphData = allData.vamms[0];
    //@ts-ignore
    const poolToken=graphData.loanPool.poolToken;
  //@ts-ignore
  const userData = allData.users[0]? allData.users[0].balances.availableUsdc:0;
  //@ts-ignore
  const ariadneData = allData.vamms[0].loanPool.poolToken.ammPool.ariadneDAO;

  const stockPriceData = await fetchStockData(params.slug.toUpperCase());
  // @ts-ignore
  const priceData = graphData.priceData;

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
              className="hidden md:block col-span-9 px-4  text-lg shadow-xl shadow-slate-500"
            >
              <PriceData priceData={priceData} stockPriceData={stockPriceData} pool={true} />
            </div>
            <section id={"select-charts"} className="col-span-9">
              <TypeSelection poolData={allData} user={user}/>
            </section>
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
                  <VaultUSDCForm availableUsdc={userData} user={user} />
              </div>

            </div>
            <StakingSection availableUsdc={userData} poolToken={graphData.loanPool.poolToken} user={user} name={stock.name} poolBalance={graphData.loanPool.poolBalance} />
          </div>
          <div id={"dao"} className="m-2 md:m-12">
            <DAOPurposals isTheseus={false} user={user} daoAddress={poolToken.ammPool.ariadneDAO.id} tokenId={poolToken.tokenId} />
            <PurposalModal ariadneData={ariadneData} loanPoolTheseus={graphData.loanPool.loanPoolTheseus} symbol={stock.symbol} ammAddress={graphData.loanPool.id} currentValue={graphData.loanPool} user={user} />
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}
