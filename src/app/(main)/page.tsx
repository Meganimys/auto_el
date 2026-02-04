import Image from "next/image";
import React, { Fragment } from "react";
import MainBanner from "@/components/client/MainBanner";
import AboutUs from "@/components/client/AboutUs";
import Services from "@/components/client/Services";

export default function Home() {
  return (
    <Fragment>
      <MainBanner></MainBanner>
      <AboutUs></AboutUs>
      <Services></Services>
    </Fragment>
  );
}
