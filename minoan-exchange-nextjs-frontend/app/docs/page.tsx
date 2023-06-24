import React, { ReactElement } from "react";
import FirstSection from "components/mainPage/FirstSection";

interface Props { }

export default function page({ }: Props): ReactElement {
  return (

    <section className="min-h-screen  text-center" id="top">
      <FirstSection/>

     
    </section>
  )

}
