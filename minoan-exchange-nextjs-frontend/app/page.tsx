import React, { ReactElement } from "react";

import Image from "next/image";
import column from "../public/assets/column.png";
import logo from "../public/assets/minotaur-logo-thing.png";
import ariadne from "../public/assets/ariadne-real.png";
import theseus from "../public/assets/stone-theseus.png";
import dynamic from "next/dynamic";
import LoanPoolTab from "../components/mainPage/loanPool/LoanPoolTab";
import ScrollUp from "../components/utils/ScrollUp";
import FirstSection from "components/mainPage/FirstSection";
import helmet2 from "../public/assets/silhoute-helmet.png";
const TradeStepper = dynamic(
  () => import("../components/mainPage/TradeStepper"),
  {
    ssr: false,
  }
);

interface Props { }

export default function page({ }: Props): ReactElement {
  return (
    <div className="text-[rgba(41,87,109,255)] ">
      <section className="min-h-screen  text-center lg:ml-8 m-2" id="top">
        <FirstSection />
      </section>
      <section className="min-h-screen  relative" id="trade-page">
        <div className="hidden lg:block relative">
          <Image
            src={column}
            alt="column"
            className="  w-[15vw] h-[90vh] absolute left-0 -z-10"
          />
          <Image
            src={column}
            alt="column"
            className="  w-[15vw] h-[90vh] transform -scale-x-100 absolute right-0 -z-10"
          />
        </div>
        <div className="flex justify-center">
          <Image src={logo} alt="logo" className="absolute -z-10 mt-" />
        </div>

        <div className="text-3xl border-4 border-slate-700 flex flex-col justify-center lg:m-64 text-center text-white  backdrop-blur-[6px] mr-8  pl-2 ml-2 md:m-4  shadow-2xl border-b-8 border-l-[6px] border-opacity-60">
          <h1>How to Trade</h1>

          <TradeStepper />
        </div>
      </section>
      <section className="h-screen relative " id="loan-pool">
        <div className="flex flex-col text-center  ">
          <h1 className="text-3xl mb-8 text-white mt-24">Loan Pools</h1>
          <div className="hidden xl:block absolute  pl-4 -z-10 mt-12">
            <Image src={ariadne} alt="ariadne" height={700} />
          </div>

          <div className=" border-4 border-slate-700  lg:mx-6 text-white m-2  backdrop-blur-[6px] p-2 shadow-2xl border-b-8 border-l-[6px] border-opacity-60 xl:ml-[40rem] lg:">
            <LoanPoolTab />
          </div>
        </div>
      </section>
      <section className="relative h-screen overflow-y-scroll scroll-hidden will-change-scroll" id="theseus-dao">
        <div className="flex flex-col  text-center m-4">
          <h1 className="text-3xl my-12 text-white">Theseus DAO</h1>
          <div className="border-4 border-slate-700 flex flex-col justify-center gap-y-8 py-8  text-center text-white m-6 backdrop-blur-[6px] p-2 shadow-2xl border-b-8 border-l-[6px] border-opacity-60 xl:mr-[40rem]  text-lg 2xl:text-xl lg:mx-20 ">
            <p>
              A DAO, or Decentralized Autonomous Organization, is a type of
              organization that operates through smart contracts on a blockchain
              network. In the context of a DeFi exchange, the DAO can be used to
              govern and manage the operations of the exchange. When users trade
              on the exchange, trading fees are generated. These fees can be
              collected by the DAO and distributed to the holders of the DAO
              tokens, similar to how dividends are paid to shareholders in a
              traditional company. This distribution can be done automatically
              through smart contracts, ensuring that the process is transparent
              and trustless.
            </p>
            <p>
              DAO token holders can also participate in the governance of the
              exchange through a voting system. They can vote on proposals such
              as changes to the trading fee structure, the addition of new
              trading pairs, or changes to the DAO's distribution mechanism.
              With Theseus DAO each stake holder is given Minoans which show
              your stake in the DAO. The more Minoans you have the more voting
              power you have. The DAO will be governed by the community and will
              be a place where the community can come together to discuss and
              vote on proposals. Such as the addition of new assets, changes to
              the trading fee structure, and changes to the distribution
              mechanism. As well as putting maximum and minimums on all the loan
              pools of the exchange for every asset. This will help to keep the
              exchange safe, secure and user friendly.
            </p>
            <p>
              When a new asset and lending pool is created for the exchange the
              DAO will vote on the maximum and minimum loan amounts for that
              asset, as well as the interest rate for that asset. The DAO will
              also be the first staker of the any new pool. The DAO will also
              recieve percentage of liquidations left over after paying the loan
              pools back and the liquidator fee. It is the job of The Theseus DAO
              to protect the entire protocol. By voting on limits for all the Ariadne
              DOA&apos;s as well as acting as an insurance fund for if the Loan pools ever run out of liquidity.
            </p>
          </div>
          <div className="hidden xl:block absolute mt-20  ml-4 -z-10 right-10">
            <Image src={theseus} alt="theseus" />
          </div>
          <div className="hidden xl:flex justify-evenly mr-[40rem] ">
            <a className="rounded-full bg-slate-800 p-4 hover:scale-125" href='/'>
              <Image src={helmet2} height={50} width={50} alt="helmet2" />
              <p className="text-white text-xs skew-y-12">Theseus Docs</p>
            </a>
            <a className="rounded-full bg-slate-800 p-4 hover:scale-125" href='/theseusDao'>
              <Image src={helmet2} height={50} width={50} alt="helmet1" className="transform -scale-x-100" />
              <p className="text-white text-xs -skew-y-12">Theseus DAO</p>
            </a>
          </div>
        </div>
      </section>
      {/* <section className=" h-screen" id="white-paper">
              <WhitePaper />
      </section> */}
      <ScrollUp className="w-10 h-10  " href="#top">
        <Image
          src={logo}
          alt="logo"
          height={40}
          className=" sticky bottom-3 right-1/2 left-1/2  "
        />
      </ScrollUp>
    </div>
  );
}