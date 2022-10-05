import React from "react";
import Pic1 from "../assets/pic1.png";
import Pic2 from "../assets/pic2.png";
import Image from "next/image";

const style = {
  container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('https://lh3.googleusercontent.com/ujepnqpnL0nDQIHsWxlCXzyw4pf01yjz1Jmb4kAQHumJAPrSEj0-e3ABMZlZ1HEpJoqwOcY_kgnuJGzfXbd2Tijri66GXUtfN2MXQA=s250')] before:bg-cover before:bg-center before:opacity-30 before:blur`,
};

const LandingHeader = () => {
  return (
    <div className="relative">
      <div className={style.container}>
        <div className="flex h-screen relative justify-center flex-wrap items-center">
          <div className="w-1/2">
            <div className="relative text-white text-[46px] font-semibold">
              Discover True Power of NFTs
            </div>
            <div className="text-[#8a939b] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]">
              Competitive multiplayer games should be accessible and fun. With
              blockchain, we add value to competition and give governance to our
              communities.
            </div>
            <div className="flex">
              <button className="relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer">
                Explore
              </button>
              <button className="relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer">
                Create
              </button>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default LandingHeader;
