import { useRouter } from "next/router";
import { stocks } from "../../utils/stockData";
import Image from "next/image";
import { Stock } from "../../../types/custom";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import DaoTransaction from "../../../components/tables/DaoTransactions";
import PurposalModal from "../../../components/modals/PurposalModal";
import StakingForm from "../../../components/forms/StakingForm";

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

  // dynamic(() => import('../../../components/charts/poolCharts/AreaChartsForPools'), {
  //   ssr: false
  // })

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
            <section
              id={"balances"}
              className=" col-span-6 md:col-span-4 lg:col-span-6 lg:mt-0 grid grid-cols-2 xl:grid-cols-3 mt-12 gap-y-12"
            >
              <div className="flex flex-col text-center">
                <h1 className="text-xl md:text-3xl lg:text-5xl">0.00</h1>
                <h3 className="text-xl"> Your Balance</h3>
              </div>
              <div className="flex flex-col text-center">
                <h1 className="text-xl md:text-3xl lg:text-5xl">$0.00</h1>
                <h3 className="text-xl"> Current Value</h3>
              </div>
              <div className="flex flex-col text-center">
                <h1 className="text-xl md:text-3xl lg:text-5xl">134533</h1>
                <h3 className="text-xl"> Total Supply</h3>
              </div>
              <div className="flex flex-col text-center">
                <h1 className="text-xl md:text-3xl lg:text-5xl">$9382.02</h1>
                <h3 className="text-xl"> Total Value</h3>
              </div>
              <div className="flex flex-col text-center">
                <h1 className="text-xl md:text-3xl lg:text-5xl">$6983.39</h1>
                <h3 className="text-xl"> Loaned Out</h3>
              </div>
              <div className="flex flex-col text-center">
                <h1 className="text-xl md:text-3xl lg:text-5xl">$2398.63</h1>
                <h3 className="text-xl"> In Vault</h3>
              </div>
            </section>{" "}
            <section
              id={"charts"}
              className="hidden md:block col-span-9  shadow-xl shadow-slate-500"
            >
              <Suspense
                fallback={
                  <p className="text-white text-3xl">Loading feed...</p>
                }
              >
                <AreaChartsForPools />
              </Suspense>
            </section>
            <section
              id={"stats"}
              className="col-span-9 lg:col-span-9 flex flex-wrap justify-evenly text-center gap-y-12"
            >
              <div className="rounded-2xl bg-gradient-to-r from-cyan-500 via-red-500 to-amber-500 p-1 shadow-xl">
                <div className="block rounded-xl bg-slate-800 -z-10 p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col gap-y-4 ">
                    <h1>Investor Stats</h1>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>Minimum Margin Ratio:</h3>
                      <h3>5%</h3>
                    </div>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>Max Leverage:</h3>
                      <h3>15X</h3>
                    </div>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>Minimum Investment:</h3>
                      <h3>$2,000.03</h3>
                    </div>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>Maximum Investment:</h3>
                      <h3>$87,039.25</h3>
                    </div>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>Interest Rate:</h3>
                      <h3>3.2 %</h3>
                    </div>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>Interest Payment Period:</h3>
                      <h3>8 hrs</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-cyan-500 via-red-500 to-amber-500 p-1 shadow-xl">
                <div className="block rounded-xl bg-slate-800 -z-10 p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col gap-y-4">
                    <h1>Staking Information</h1>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>Stakers:</h3>
                      <h3>126</h3>
                    </div>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>USDC to Tok:</h3>
                      <h3>12:3</h3>
                    </div>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>ROI (72h) avg:</h3>
                      <h3>$475.02</h3>
                    </div>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>Reward %:</h3>
                      <h3>48 %</h3>
                    </div>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>Reward Period:</h3>
                      <h3>96 hrs</h3>
                    </div>
                    <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                      <h3>Minimum Stake:</h3>
                      <h3>$2.05</h3>
                    </div>
                  </div>
                </div>
              </div>
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
            <h1 className="text-white text-5xl text-center">DAO</h1>
            <h3 className="text-white text-2xl mb-4  ">Proposals</h3>
            <DaoTransaction />

            <PurposalModal />
          </section>
        </div>
      )}
    </div>
  );
}
