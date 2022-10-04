import { FaArrowRight } from "react-icons/fa";
import Logo from '../../assets/piximarket.svg'
import Image from 'next/image';
export default function Footer() {
  return (
    <>
      <div
        className="border-t-2 border-pink-100 bg-[#2f302f] mt-25 py-10"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        <div className="container mx-auto">
          <div className="grid grid-col-2 md:grid-cols-5 gap-2 md:gap-6 text-center md:text-left">
            <div className="flex col-span-2">
            <Image src={Logo} className="mr-3  h-8" alt="Flowbite Logo"  height={40}
            width={40} />
          <span className="self-center ml-2 text-2xl font-semibold whitespace-nowrap text-white">
            NFT Marketplace
          </span>
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl">Quick Links</h2>
              <p className="mt-6 text-white">About</p>
              <p className="text-white">Blog</p>
              <p className="text-white">Press</p>
            </div>
            <div>
              <h2 className="text-white font-bold text-2xl">Resources</h2>
              <p className="mt-6 text-white">Help Center</p>
              <p className="text-white">Community</p>
              <p className="text-white">Partners</p>
            </div>
            <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start">
              <h2 className="font-primary font-bold text-2xl text-white">Subscribe</h2>
              <button className="bg-transparent hover:text-tertiary hover:bg-[#7c498f] mt-6 text-white border-pink-100 hover:border-[#7c498f]  px-8 py-3 border-2 rounded-full font-semibold transition-all flex items-center gap-2">
                Get NFT Updates <FaArrowRight />
              </button>
            </div>
          </div>
          <hr className="my-6 border-pink-100 lg:my-8" />
      <span className="block text-sm  sm:text-center 
      text-white">
        © 2022{" "}
        <a href="https://flowbite.com" className="hover:underline text-white">
          NFT Marketplace™
        </a>
        . All Rights Reserved.
      </span>
        </div>
      </div>
    </>
  );
}
