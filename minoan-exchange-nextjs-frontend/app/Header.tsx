import Link from "next/link";
import React from "react";
import Image from "next/image";
import logo from "../public/assets/minotaur-logo-thing.png";

interface Props {}

const Header: React.FC<Props> = () => {
  return (
    <header className="h-[5vh] bg-slate-700 flex gap-x-4 text-white">
      <Link href="/" className="p-2  flex flex-row ">
        <Image src={logo} alt="logo" height={20} width={35} />
        <h1 className="ml-2 mt- text-sm"></h1>
      </Link>
      <Link href="/todos" className="mt-2">
        Docs
      </Link>
    </header>
  );
};

export default Header;
