import Image from "next/image";
import React from "react";
import TheseusTab from "../../components/tabs/TheseusTab";
import theseus from "../../public/assets/theseus-removed.png";
import { redirect } from "next/navigation";
import { request, gql } from 'graphql-request';
import StakingSection from "../../components/forms/StakingSection";
import { theseus as theseusAdd } from "../../utils/address";
import DAOPurposals from "../../components/tables/daos/DAOPurposals";
import TheseusProposalModal from "../../components/modals/proposal/TheseusProposalModal";
import { authOptions } from "../../utils/auth/authOptions";
import { getServerSession } from "next-auth";
import { Address } from "wagmi";
import Ranges from "../../components/theseus/Ranges";
import ProtocalStats from "../../components/theseus/ProtocalStats";
import Balances from "../../components/theseus/Balances";
import { fetchTheseus } from "app/lib/graph/theseusData";

type Props = {};

async function page(props: Props) {

  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.name) {
    return redirect(`/auth/signin?callbackUrl=/theseusDao`);
  }
  const user = session.user.name as Address;
  const data = await fetchTheseus(session.user.name, theseusAdd);
  //@ts-ignore
  const poolAvailableUsdc = data.users[0]?data.users[0].balances.availableUsdc:0;
  console.log('poolAvaib', poolAvailableUsdc);
  console.log('data', data);
  //@ts-ignore
  const poolBalance = { availableUsdc: data.stakes[0] ? data.stakes[0].totalStaked - data.theseusDAOs[0] ? data.theseusDAOs[0].insuranceFundMin : 0 : 0, totalUsdcSupply: data.stakes[0] ? data.stakes[0].totalStaked : 0 };
  return (
    <div className="m-6 ">
      <div className="flex flex-row justify-between">
        <div className="mt-12 ml-24 text-white  ">
          <h1 className="text-5xl ">Theseus DAO</h1>
          <Balances />
        </div>
        <div className="hidden lg:block">
          <Image alt={"theseus"} src={theseus} height={720} />
        </div>
      </div>
      <div className="flex flex-row justify-center mx-2 my-8  md:m-8 border-4 border-amber-400">
        <TheseusTab />
      </div>
      <div className="flex flex-wrap justify-evenly text-center gap-y-12 text-white">
        <Ranges />
        <ProtocalStats />
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
          <DAOPurposals daoAddress={data.theseusDAOs[0] ? data.theseusDAOs[0].id : '0x831EA4685Fc3b8fF331eB4887070Ba42C15FC8E4'} user={user} tokenId={data.theseusDAOs[0] ? data.theseusDAOs[0].tokenId : 0} isTheseus={true} />
        </div>
      </div>

      <div className="flex justify-center">
        <TheseusProposalModal user={user} />
      </div>
    </div>
  );
};

export default page;
