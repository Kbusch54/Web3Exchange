import React, { ReactElement } from "react";
import Image from "next/image";

import main from "../../public/assets/main-background.png";
import column from "../../public/assets/column.png";
import Bs from "../../components/randomExamples/Bs";
import Columns from "components/mainPage/Columns";
import MainLanding from "components/mainPage/MainLanding";
import FirstSection from "components/mainPage/FirstSection";

interface Props { }

export default function page({ }: Props): ReactElement {
  return (
    <section className="min-h-screen  text-center" id="top">
      <FirstSection/>

     
    </section>
  )

}
