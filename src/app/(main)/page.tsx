import React, { Fragment } from "react";
import MainBanner from "@/components/client/MainBanner";
import AboutUs from "@/components/client/AboutUs";
import Services from "@/components/client/Services";
import Aplication from "@/components/client/Aplication";
import UserQuality from "@/components/client/UserQuality";

export default function Home() {
  return (
    <Fragment>
      <MainBanner></MainBanner>
      <AboutUs></AboutUs>
      <Services></Services>
      <UserQuality></UserQuality>
      <Aplication></Aplication>
    </Fragment>
  );
}
