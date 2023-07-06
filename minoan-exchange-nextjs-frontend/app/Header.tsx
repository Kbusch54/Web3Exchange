
import React from "react";
import Image from "next/image";
import logo from "../public/assets/minotaur-logo-thing.png";
import ConnectingButton from "../components/rainbowkit/ConnectingButton";
import NavButton from "../components/utils/nav/NavButton";

interface Props { }

const Header: React.FC<Props> = () => {
  return (
    <header className=" bg-slate-700 ">
      
      <div className="flex gap-x-4 text-white justify-between align-center mx-6">

        <div className="flex flex-row justify-around gap-x-6 align-middle items-center">

          <a href="/" className="p-2  flex align-middle items-center ">
            <Image src={logo} alt="logo" height={20} width={35} />
          </a>
          <div className="block lg:hidden  ">

            <NavButton />
          </div>
        </div>
        <div className=" hidden lg:flex  gap-x-14 lg:gap-x-20 xl:gap-x-32 2xl:gap-x-64 text-center align-middle text-lg  ">
          <a className="bg-slate-800 rounded-3xl px-4 pt-2 my-2 hover:scale-110" href="/docs">
            Docs
          </a>
          <a className="bg-slate-800 rounded-3xl px-4 pt-2 my-2 hover:scale-110" href="/theseusDao">Theseus Dao</a>
          <a className="bg-slate-800 rounded-3xl px-4 pt-2 my-2 hover:scale-110" href="/pools">Pools</a>
          <a className="bg-slate-800 rounded-3xl px-4 pt-2 my-2 hover:scale-110" href="/invest">Invest</a>
          <a className="bg-slate-800 rounded-3xl px-4 pt-2 my-2 hover:scale-110" href="/dashboard">Dashboard</a>
        </div>
        <div className="my-2 align-middle items-center">
          <ConnectingButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
