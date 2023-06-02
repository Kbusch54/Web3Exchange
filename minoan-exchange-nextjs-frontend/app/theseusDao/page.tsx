import Image from "next/image";
import React from "react";
import PurposalModal from "../../components/modals/ProposalModal";
import DaoTransaction from "../../components/tables/daos/DaoTransactions";
import TheseusTab from "../../components/tabs/TheseusTab";
import theseus from "../../public/assets/theseus-removed.png";
import { getServerSession } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { request, gql } from 'graphql-request';
import StakingSection from "../../components/forms/StakingSection";
import { theseus as theseusAdd } from "../../utils/address";
import DAOPurposals from "../../components/tables/daos/DAOPurposals";
import TheseusProposalModal from "../../components/modals/TheseusProposalModal";
async function fetchData(user: string, theseusAdd: string) {
  const query = gql` 
    query getvamm($user: String!, $theseusAdd: String!) {
     
      theseusDAOs{
        id
        currentId
        votingTime
        maxVotingPower
        minVotingPower
        tokenId
        votesNeededPercentage
        insuranceFundMin
        poolToken{
          tokenId
          totalSupply
          tokenBalance(where:{user:$user}){
              tokensOwnedbByUser
              totalStaked
            }

        }
      }
      stakes(where:{theseusDAO:$theseusAdd}){
        totalStaked
      }
      vamms {
        name
        loanPool {
          id
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



  const endpoint = "https://api.studio.thegraph.com/query/46803/subgraph-minoan/v0.1.9";
  const variables = { user: user, theseusAdd: theseusAdd };
  const data = await request(endpoint, query, variables);

  return data;
}
type Props = {};

async function page(props: Props) {
  const session = await getServerSession();
  if (!session) {
    redirect(`/auth/signin?callbackUrl=/theseusdao`);
  }
  const data = await fetchData(session.user.name, theseusAdd);
  //@ts-ignore
  const poolAvailableUsdc = data.users[0].balances.availableUsdc;
  console.log('poolAvaib', poolAvailableUsdc);
  console.log('data', data);
  //@ts-ignore
  const poolBalance = { availableUsdc: data.stakes[0].totalStaked - data.theseusDAOs[0].insuranceFundMin, totalUsdcSupply: data.stakes[0].totalStaked };
  return (
    <div className="m-6 ">
      <div className="flex flex-row justify-between">
        <div className="mt-12 ml-24 text-white  ">
          <h1 className="text-5xl ">Theseus DAO</h1>
          <div className="balance-container">
            <div className="">
              <h1 className="">0.00</h1>
              <h3> Your Balance</h3>
            </div>
            <div className="">
              <h1 className="">$0.00</h1>
              <h3> Current Value</h3>
            </div>
            <div className="">
              <h1 className="">134533</h1>
              <h3> Total Supply</h3>
            </div>
            <div className="">
              <h1 className="">$9382.02</h1>
              <h3> Total Value</h3>
            </div>
            <div className="">
              <h1 className="">$6983.39</h1>
              <h3>Total Loaned Out</h3>
            </div>
            <div className="">
              <h1 className="">$2398.63</h1>
              <h3>Total In Vault</h3>
            </div>
            <div className="">
              <h1 className="">$2398.63</h1>
              <h3>Insurance Fund</h3>
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
        <div>

          {/* @ts-ignore */}
          <StakingSection availableUsdc={poolAvailableUsdc} poolToken={data.theseusDAOs[0].poolToken} user={session.user.name} name={'Theseus'} poolBalance={poolBalance} />
        </div>
        <div className="mb-12">
          {/* @ts-ignore */}
          <DAOPurposals daoAddress={data.theseusDAOs[0].id} user={session.user.name} tokenId={data.theseusDAOs[0].tokenId} isTheseus={true}/>
        </div>
      </div>

      <div className="flex justify-center">
        <TheseusProposalModal />
      </div>
    </div>
  );
};

export default page;
