import React, { ReactElement } from "react";

import Image from "next/image";

import main from "../public/assets/main-background.png";
import column from "../public/assets/column.png";
import Link from "next/link";
import logo from "../public/assets/minotaur-logo-thing.png";
import ariadne from "../public/assets/ariadne-real.png";
import theseus from "../public/assets/stone-theseus.png";
import dynamic from "next/dynamic";
import LoanPoolTab from "../components/LoanPoolTab";
import ScrollUp from "../components/utils/ScrollUp";
import FirstSection from "components/mainPage/FirstSection";
import helmet1 from "../public/assets/greek-helmet.png";
import helmet2 from "../public/assets/silhoute-helmet.png";
const TradeStepper = dynamic(
  () => import("../components/mainPage/TradeStepper"),
  {
    ssr: false,
  }
);

interface Props {}

export default function page({}: Props): ReactElement {
  return (
    <div className="text-[rgba(41,87,109,255)] ">
      <section className="min-h-screen  text-center lg:ml-8 m-2" id="top">
       <FirstSection/>
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

          <div className="border-4 border-slate-700  lg:mx-6 text-white m-2  backdrop-blur-[6px] p-2 shadow-2xl border-b-8 border-l-[6px] border-opacity-60 xl:ml-[40rem] lg:">
            <LoanPoolTab />
          </div>
        </div>
      </section>
      <section className="relative h-screen overflow-y-scroll scroll-hidden will-change-scroll" id="theseus-dao">
        <div className="flex flex-col  text-center m-4">
          <h1 className="text-3xl my-12 text-white">Theseus DAO</h1>
          <div className="border-4 border-slate-700 flex flex-col justify-center gap-y-8 py-8  text-center text-white m-6 backdrop-blur-[6px] p-2 shadow-2xl border-b-8 border-l-[6px] border-opacity-60 xl:mr-[40rem] max-w-5xl text-lg 2xl:text-xl ">
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
          <div className="hidden xl:flex justify-evenly  ">
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
      <section className="n" id="white-paper">
        <div className="flex text-center justify-center align-middle">
        <div className="flex flex-col justify-center align-middle m-12 text-center mt-20 bg-white 2xl:mx-96  p-6 max-w-6xl 4xl:max-w-none">
          <h1 className="text-center text-xl">
            {" "}
            Minoan Exchange: A Perpetual Defi Exchange
          </h1>
          <h3 className="text-lg font-bold">Introduction</h3>
          <p>
            The Minoan Exchange is a perpetual defi exchange that allows users
            to invest USDC and receive ERC20 pool tokens in return. These pool
            tokens are proportional to the user's investment compared to the
            rest of the pool at that time. The Minoan Exchange includes loan
            pools called Ariadne pools, which allow users to borrow USDC with
            interest set by the corresponding Ariadne DAO. In this white paper,
            we will explore the functionalities of the Minoan Exchange protocol
            in detail.
          </p>
          <h3 className="text-lg font-bold">Loan Pools (Ariadne Pools)</h3>
          <p>
            The Minoan Exchange has a loan pool for each individual stock asset,
            called Ariadne pools. Users can invest USDC in these pools and
            receive ERC20 pool tokens proportional to their investment. They can
            use funds in each loan pool to borrow USDC with interest, set by the
            individual DAOs of the corresponding loan pool. The interest is
            charged to a block timestamp set by the pool, with a fixed
            percentage set by the pool. Users must maintain the minimum margin
            requirement (MMR) of USDC held in the vault contract via the trade
            ID for the specific trade the user executed. The loaner can repay
            parts of the loan at any time. The user can add leverage on the
            position, which will borrow more funds. If the user does not meet
            the MMR at any time, the position is subject to liquidation.
          </p>
          <p>
            Users who provide liquidity via the loan pools earn USDC by
            investors who trade on the exchange, trading fees, and loan
            payments. A liquidity provider can sell back their ERC20 loan pool
            tokens to the protocol at any time and receive a proportional amount
            of USDC to the total amount held versus their stake. As long as the
            pool maintains stability, set by the loan pool's DAO aka Ariadne DAO
            for the specific asset, there is a staking reward to be claimed
            after a certain amount of time, determined by the DAO. This can only
            be claimed if the staker staked their USDC in the previous snapshot.
            The pool increases in value when a user of the exchange aka an
            investor and borrower pays loan payments and from trading fees. A
            certain percentage of these (determined by the DAO) will be sent to
            the vault contract, and the snapshot struct on the staking contract
            will reflect the USDC rewards amount. All unclaimed rewards are sent
            back to the staking contract upon the next snapshot interval. The
            loan pool can lose value via when a borrower 'wins' or sells their
            position for a higher amount. If the loan pool is drained to a
            certain degree, the protocol will activate the insurance fund at
            which point the debts owed to an investor will come from there. Then
            some of the rewards in the future will go to replenish the USDC used
            from the insurance fund for that loan pool.
          </p>

          <h3 className="text-lg font-bold">Vault Contract</h3>
          <p>
            The Minoan Exchange's vault contract holds all funds not locked into
            a loan pool (Ariadne pool). If a user wants to use the exchange, the
            user must first deposit USDC in the vault. The vault will keep track
            of all balances. When a user deposits funds, it goes into a mapping
            called availableBalances. This can be used as collateral and locked
            if a user decides to use the exchange. Other balances the vault
            keeps track of are tradeBalance, which is the amount loaned from the
            loan pool, tradeCollateral, which is the collateral set aside for a
            specific trade and loan MMR, poolOutstandingLoans, which keeps track
            of USDC loaned from a specific loan pool, tradeInterest, which keeps
            track of specific In addition to its other functionalities, the
            vault contract can also handle liquidation of positions. If a user
            does not maintain the minimum margin requirement for their position,
            their collateral can be liquidated, which involves selling off the
            collateral and using the proceeds to pay back the loan. The
            liquidation is triggered automatically by the smart contract when
            the margin requirement is breached.
          </p>
          <p>
            Furthermore, the vault contract is also responsible for managing the
            insurance fund. If a loan pool becomes insolvent and the debts
            cannot be covered by the pool's funds, the insurance fund will be
            used to cover the remaining debts. DAO holders' capital is used to
            fund the insurance fund, and any excess funds above the maximum
            capacity will be added to the treasury. If the DAO determines it
            appropriate, a percentage of the treasury funds may be distributed
            as dividends to the DAO holders.
          </p>
          <p>
            Overall, the Minoan Exchange protocol offers a comprehensive and
            robust perpetual decentralized exchange experience, allowing users
            to borrow and lend funds with interest, trade a variety of assets,
            and stake their holdings to earn rewards. The protocol's design
            ensures stability and security for all users, while the involvement
            of the Theseus DAO and Ariadne DAOs provide a mechanism for
            community governance and decision-making.
          </p>
          <h3 className="text-lg font-bold">The exchange contract </h3>
          <p>
            Allows users and the vault contract to open a position on a specific
            AMM of the asset they wish to bet on, which generates a unique
            tradeId in bytes form. The position is added to a struct with
            relevant information and added to the positions array. Users can
            close out positions, add or remove liquidity, and add or remove
            leverage through the exchange contract, which updates the struct and
            positions array accordingly. Each AMM contract is unique to the
            asset it represents and calculates current funding rate, cummulative
            notional, timestamp, block number, total position size, quote asset
            reserve, base asset reserve, start index price, final index price,
            and more. The AMM funding rate is calculated every time the exchange
            contract interacts and snapshots are updated at the end of each
            interval period.
          </p>
          <h3 className="text-lg font-bold">DAO&apos;s</h3>
          <p>
            Ariadne DAOs correspond to specific loan pools and underlying
            assets, controlled by stakers who can set various parameters such as
            max leverage, minimum margin requirements, rewards percentage, max
            loan amount, loan interest rate, and reward period. The Theseus DAO
            controls the max and min values for each variable to prevent
            unappealing loan pools, manages trading fees and insurance fund, and
            deploys new loan pools and AMMs. The Minoan Exchange is on Goreli
            chain and uses the ChainAPI oracle for real-time data. The USDC is
            specific to the protocol and can be obtained via a faucet on the
            site. Automatic liquidation bots are used instead of user-run ones
            for showcasing the protocol.
          </p>
        </div>
        </div>
      </section>
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