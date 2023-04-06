import Image from "next/image";
import React from "react";
import PurposalModal from "../../components/modals/PurposalModal";
import DaoTransaction from "../../components/tables/DaoTransactions";
import TheseusTab from "../../components/tabs/TheseusTab";
import theseus from "../../public/assets/theseus-removed.png";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="m-6">
      <div className="flex flex-row justify-between">
        <div className="mt-12 ml-24 text-white  ">
          <h1 className="text-5xl ">Theseus DAO</h1>
          <div>
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
          </div>
        </div>
        <div className="hidden lg:block">
          <Image alt={"theseus"} src={theseus} height={720} />
        </div>
      </div>
      <div className="flex flex-row justify-center m-8 border-4 border-amber-400">
        <TheseusTab />
      </div>
      <div className="flex flex-wrap justify-evenly text-center gap-y-12 text-white">
        <div className="rounded-2xl bg-gradient-to-r from-cyan-500 via-red-500 to-amber-500 p-1 shadow-xl">
          <div className="block rounded-xl bg-slate-800 -z-10 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-y-4 ">
              <h1 className="text-xl">Ranges Allowed</h1>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Minimum Margin Ratio:</h3>
                <h3>2% - 10%</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Minimum Leverage:</h3>
                <h3>2X</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Maximum Leverage:</h3>
                <h3>20X</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Minimum Investment</h3>
                <h3>$950.00</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Maximum Investment:</h3>
                <h3>$20,000.00</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Reward %:</h3>
                <h3>20% - 70%</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Interest Rates:</h3>
                <h3>1% - 10%</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Interest Period:</h3>
                <h3>4hrs - 48hrs</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Reward period:</h3>
                <h3>8hrs - 24hrs</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-cyan-500 via-red-500 to-amber-500 p-1 shadow-xl">
          <div className="block rounded-xl bg-slate-800 -z-10 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-y-4">
              <h1 className="text-xl">Protocal Stats</h1>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Total USDC Traded:</h3>
                <h3>$472,973.32</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Outstanding Debt Owned:</h3>
                <h3>$2,348.84</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Amount in Insurance Fund:</h3>
                <h3>$47,567.02</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Insurance Fund Cap:</h3>
                <h3>$50,000.00</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Cummulative DAO Earnings:</h3>
                <h3>$24,948.00</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Trader Earnings:</h3>
                <h3>$20,383.05</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Cummulative Pool Earnings:</h3>
                <h3>$36,837.00</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>Total Number of Pools:</h3>
                <h3>3</h3>
              </div>
              <div className="flex flex-row gap-x-24 text-lg text-center justify-between">
                <h3>USDC in DAO:</h3>
                <h3>$394,948.93</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 flex flex-col ">
        <h1 className="text-3xl text-white justify-center text-center mb-2">
          DAO Purposals
        </h1>
        <DaoTransaction />
      </div>

      <div className="flex justify-center">
        <PurposalModal />
      </div>
    </div>
  );
};

export default page;
