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

interface Props {
  params: {
    slug: string;
  };
}

const getStocks = async (slug: string) => {
  const s: Stock | undefined = stocks.find(
    (stock) => stock.slug === Number(slug)
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
              <h1>{stock.name}</h1>
              <h3 className="text-xl">{stock.symbol}</h3>
            </div>
            <Balances />
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
              <InvestorStats />
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
