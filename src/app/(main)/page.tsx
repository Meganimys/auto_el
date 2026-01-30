import Image from "next/image";
import React, { Fragment } from "react";
import MainBanner from "@/components/client/MainBanner";
import AboutUs from "@/components/client/AboutUs";

export default function Home() {
  return (
    <Fragment>
      <MainBanner></MainBanner>
      <AboutUs></AboutUs>
    </Fragment>
  );
}
