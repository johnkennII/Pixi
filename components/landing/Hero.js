import Button from "./Button";
import Image from "next/image";
import Avatar from "../../assets/pic7.svg";
import Spline from "@splinetool/react-spline";

export default function Hero() {
  return (
    <>
      <div className=" py-20 md:py-24 h-[700px]">
        <div className="grid grid-cols-1 md:grid-cols-2 container mx-auto">
          <div
            className="flex flex-col gap-8 text-center items-center md:text-left md:items-start"
            data-aos="fade-up"
            data-aos-duration="2000"
          >
            <h1 className="text-5xl text-center md:text-left md:text-8xl text-white">
              Play-to-Own <span className="text-white">Game</span> <br />
              <span className="pb-3 block bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-cyan-400 sm:pb-5">
                For Everyone
              </span>{" "}
            </h1>
            <p className="text-white md:text-xl">
              Building Play-to-Own For Everyone
            </p>
          </div>
          <div>
            <Image src={Avatar} alt="avatar" width={600} height={500} />
          </div>
        </div>
      </div>
    </>
  );
}
