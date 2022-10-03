import React from "react";
import Pic1 from '../assets/pic1.png'
import Pic2 from '../assets/pic2.png'
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
            <div className="relative text-white text-[46px] font-semibold">Discover Charitable Activities</div>
            <div className="text-[#8a939b] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]">
              Cultchain is a Web3 Based Marketplace for Charities Activities
            </div>
            <div className="flex">
              <button className="relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer">Explore</button>
              <button className="relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer">Create</button>
            </div>
          </div>
          <div className="rounded-[3rem]">
            <Image className="rounded-t-lg" src={Pic1} alt="pic1"
            />
            <div className="h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white">
              <Image className="h-[2.25rem] rounded-full"src={Pic2} alt="pic2"
              />
              <div className="flex flex-col justify-center ml-4">
                <div className={style.name}>Jolly</div>
                <a
                  className="text-[#1868b7]"
                  href="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/2324922113504035910649522729980423429926362207300810036887725141691069366277"
                >
                  hola-kanola
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHeader;
