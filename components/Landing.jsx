import React from "react";
import Hero from "./landing/Hero";
import Collections from "./landing/Collections";
import Steps from "./landing/Steps";
import Creators from "./landing/Creators";
import Community from "./landing/Community";
import Timer from "./Timer";

const Landing = () => {
  return (
    <div style={{ background: "#000502", height: "auto" }}>
      <Timer/>
      <Hero />
      <Collections />
      <Steps />
      <Creators />
      <Community />
    </div>
  );
};

export default Landing;
