
import React from "react";
import Image from "next/image";
import logo from "../public/assets/minotaur-logo-thing.png";
import ConnectingButton from "../components/rainbowkit/ConnectingButton";

interface Props { }

const Header: React.FC<Props> = () => {
  return (
    <header className=" bg-slate-700 ">
      <div className="flex gap-x-4 text-white justify-between align-center mx-6">

        <a href="/" className="p-2  flex flex-row ">
          <Image src={logo} alt="logo" height={20} width={35} />
          <h1 className="inline md:hidden ml-14 text-2xl text-white align-middle text-left">HH</h1>
        </a>
        <div className=" hidden md:flex gap-x-14 lg:gap-x-20 xl:gap-x-32 2xl:gap-x-64 mt-4 ">
          <a href="/todos">
            Docs
          </a>
          <a href="/theseusDao">Theseus Dao</a>
          <a href="/pools">Pools</a>
          <a href="/invest">Invest</a>
          <a href="/dashboard">Dashboard</a>
        </div>
        <div className="mt-3">
          <ConnectingButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
