import React, { ReactElement } from "react";

import Image from "next/image";

import main from "../public/assets/main-background.png";
import column from "../public/assets/column.png";

interface Props {}

export default function page({}: Props): ReactElement {
  return (
    <div className="text-[rgba(41,87,109,255)] ">
      <section className="h-screen flex justify-center  lg:ml-8">
        <div className="absolute flex ">
          <Image
            src={main}
            alt="logo"
            className="relative hidden md:block  w-[70vw] h-[90vh] "
          />
        </div>
        <div className="md:grid grid-cols-4  lg:grid-cols-2 lg:px-24  z-30 text-center">
          {/* w-[90vw] mt-36 ml-24 */}
          <div className="col-span-2 lg:col-span-1  lg:mr-12 flex flex-col z-30 mt-24 gap-y-4 ">
            <h1 className="text-2xl text-white">MINOAN EXCHANGE</h1>
            <h3>A Perpetual stock exchange</h3>
            <p className="text-white text-xs md:mx-24 lg:mx-36">
              Minoan exchange allows user to trade s&p500 stocks using p2p funds
              with USDC, to short or long stocks. Utilizing DOA's and real time
              stock data. Become a liquidity provider to lend to traders, and
              earn interest on your loans. Or lend from the pools and start
              betting. Learn more by clicking one of the tabs, or go to the
              Docs.
            </p>
            <div className="m-2 px-24">
              <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 ">
                <div>How to trade</div>
                <div>How to beome liquidity provider</div>
                <div>Join the Thesus DOA</div>
                <div>Thesus DOA</div>
                <div>Ariadne Pools</div>
                <div>White Paper</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="h-screen">
        number 2
        <div>
          <Image src={column} />
        </div>
      </section>
      <section className="h-screen">number 3</section>
      <section className="h-screen">number 4</section>
    </div>
  );
}
