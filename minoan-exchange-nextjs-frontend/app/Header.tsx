
import React from "react";
import Image from "next/image";
import logo from "../public/assets/minotaur-logo-thing.png";
import ConnectingButton from "../components/rainbowkit/ConnectingButton";

interface Props { }

const Header: React.FC<Props> = () => {
  return (
    <header className="h-[5vh] bg-slate-700 flex gap-x-4 text-white justify-between align-center">
      <a href="/" className="p-2  flex flex-row ">
        <Image src={logo} alt="logo" height={20} width={35} />
        <h1 className="ml-2 mt- text-sm"></h1>
      </a>
      <div className="flex  gap-x-32 mt-4 ">
        <a href="/todos">
          Docs
        </a>
        <a href="/theseusDao">Theseus Dao</a>
        <a href="/pools">Pools</a>
        <a href="/invest">Invest</a>
        <a href="/dashboard">Dashboard</a>
      </div>
      <ConnectingButton />  
    </header>
  );
};

export default Header;
