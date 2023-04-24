import React, { ReactElement } from "react";
import Bs from "../../components/randomExamples/Bs";

interface Props {}

export default function page({}: Props): ReactElement {
  return <div className="text-white text-2xl">
    <Bs/>
  </div>;
}
