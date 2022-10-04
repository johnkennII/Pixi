import { FaArrowRight } from "react-icons/fa";
import Logo from '../../assets/piximarket.svg'
import Image from 'next/image';
export default function Footer() {
  return (
    <>
      <div
        className="border-t-2 border-[#4e2f6b] bg-[#2f302f] mt-25 py-10"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        <div className="container mx-auto">
          <div className="grid grid-col-2 md:grid-cols-5 gap-2 md:gap-6 text-center md:text-left">
            <div className="flex col-span-2">
            <Image src={Logo} className="mr-3  h-8" alt="Flowbite Logo"  height={40}
            width={40} />
          <span className="self-center ml-2 text-2xl font-semibold whitespace-nowrap text-[#2b0351]">
            NFT Marketplace
          </span>
            </div>
            <div>
              <h2 className="text-[#2b0351] font-bold text-2xl">Quick Links</h2>
              <p className="mt-6 text-[#2b0351]">About</p>
              <p className="text-[#2b0351]">Blog</p>
              <p className="text-[#2b0351]">Press</p>
            </div>
            <div>
              <h2 className="text-[#2b0351] font-bold text-2xl">Resources</h2>
              <p className="mt-6 text-[#2b0351]">Help Center</p>
              <p className="text-[#2b0351]">Community</p>
              <p className="text-[#2b0351]">Partners</p>
            </div>
            <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start">
              <h2 className="font-primary font-bold text-2xl text-[#2b0351]">Subscribe</h2>
              <button className="bg-transparent hover:text-tertiary hover:bg-[#7c498f] mt-6 text-[#2b0351] border-[#2b0351] hover:border-[#7c498f]  px-8 py-3 border-2 rounded-full font-semibold transition-all flex items-center gap-2">
                Get NFT Updates <FaArrowRight />
              </button>
            </div>
          </div>
          <hr className="my-6 border-[#4e2f6b] lg:my-8" />
      <span className="block text-sm  sm:text-center 
      text-[#2b0351]">
        © 2022{" "}
        <a href="https://flowbite.com" className="hover:underline text-    [#2b0351]">
          NFT Marketplace™
        </a>
        . All Rights Reserved.
      </span>
        </div>
      </div>
    </>
  );
}
