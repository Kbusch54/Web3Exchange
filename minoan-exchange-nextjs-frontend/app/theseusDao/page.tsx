import Image from "next/image";
import React from "react";
import TheseusTab from "../../components/tabs/TheseusTab";
import theseus from "../../public/assets/theseus-removed.png";
import { redirect } from "next/navigation";
import { request, gql } from 'graphql-request';
import StakingSection from "../../components/forms/StakingSection";
import { theseus as theseusAdd } from "../../utils/address";
import DAOPurposals from "../../components/tables/daos/DAOPurposals";
import TheseusProposalModal from "../../components/modals/TheseusProposalModal";
import { authOptions } from "../../utils/auth/authOptions";
import { getServerSession } from "next-auth";
import { Address } from "wagmi";
import Ranges from "../../components/theseus/Ranges";
import ProtocalStats from "../../components/theseus/ProtocalStats";
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



  const endpoint = "https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
  const variables = { user: user, theseusAdd: theseusAdd };
  const data = await request(endpoint, query, variables);

  return data;
}
type Props = {};

async function page(props: Props) {

  const session = await getServerSession(authOptions)
  if(!session || !session.user || !session.user.name){
      return redirect(`/auth/signin?callbackUrl=/theseusdao`);
  }
  const user = session.user.name as Address;
  const data = await fetchData(session.user.name, theseusAdd);
  //@ts-ignore
  const poolAvailableUsdc = data.users[0].balances.availableUsdc;
  console.log('poolAvaib', poolAvailableUsdc);
  console.log('data', data);
  //@ts-ignore
  const poolBalance = { availableUsdc: data.stakes[0] ? data.stakes[0].totalStaked - data.theseusDAOs[0]?data.theseusDAOs[0].insuranceFundMin:0 : 0, totalUsdcSupply: data.stakes[0] ? data.stakes[0].totalStaked : 0 };
  return (
    <div className="m-6 ">
      <div className="flex flex-row justify-between">
        <div className="mt-12 ml-24 text-white  ">
          <h1 className="text-5xl ">Theseus DAO</h1>
          <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 3xl:grid-cols-7   mt-12 gap-y-6 gap-x-6 text-white">
            <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
              <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">0.00</h1>
             <h3 className='text-xs md:text-lg'> Your Balance</h3>
            </div>
            <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
              <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">$0.00</h1>
             <h3 className='text-xs md:text-lg'> Current Value</h3>
            </div>
            <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
              <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">134533</h1>
             <h3 className='text-xs md:text-lg'> Total Supply</h3>
            </div>
            <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
              <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">$9382.02</h1>
             <h3 className='text-xs md:text-lg'> Total Value</h3>
            </div>
            <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
              <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">$6983.39</h1>
             <h3 className='text-xs md:text-lg'>Total Loaned Out</h3>
            </div>
            <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40 ">
              <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">$2398.63</h1>
             <h3 className='text-xs md:text-lg'>Total In Vault</h3>
            </div>
            <div className="flex flex-col text-center border-2 border-blue-800 rounded-t-2xl rounded-b-xl bg-sky-800  bg-opacity-40  ">
              <h1 className="text-xl xl:text-2xl 3xl:text-3xl 4xl:text-5xl mt-4">$2398.63</h1>
             <h3 className='text-xs md:text-lg'>Insurance Fund</h3>
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
       <Ranges/>
      <ProtocalStats/>
      </div>
      <div className="mt-12 flex flex-col ">
        <div>

          {/* @ts-ignore */}
          <StakingSection availableUsdc={poolAvailableUsdc} poolToken={data.theseusDAOs[0] ? data.theseusDAOs[0].poolToken : {
            id: '0',
            tokenId: 0,
            totalSupply: 0,
            tokenBalance: 0,
            ammPool: 0,
            isFrozen: true
          }} user={user} name={'Theseus'} poolBalance={poolBalance} />
        </div>
        <div className="mb-12">
          {/* @ts-ignore */}
          <DAOPurposals daoAddress={data.theseusDAOs[0]?data.theseusDAOs[0].id:'0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42'} user={user} tokenId={data.theseusDAOs[0]?data.theseusDAOs[0].tokenId:0} isTheseus={true} />
        </div>
      </div>

      <div className="flex justify-center">
        <TheseusProposalModal user={user} />
      </div>
    </div>
  );
};

export default page;
