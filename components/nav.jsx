import connect from "./utils/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "../assets/piximarket.svg";
import { BiMenu, BiXCircle } from "react-icons/bi";

export default function Nav() {
  const [active, setActive] = useState(true);
  const [account, setAccount] = useState();

  useEffect(() => {
    showAccount();
  }, []);

  async function showAccount() {
    const { account } = await connect();
    setAccount(account.substring(36, 42));
  }

  return (
    <nav className="bg-[#2f302f] px-2 sm:px-2 py-2.5 border-dark">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link href="/">
          <a>
            <div className="flex items-center cursor-pointer">
              <Image src={Logo} alt="PixiMarket logo" height={40} width={40} />
              <div className="ml-[0.8rem] text-white font-semibold text-2xl">
                PixiMarket
              </div>
            </div>
          </a>
        </Link>
        <div className="flex md:order-2 md:hidden">
          <button type="button" onClick={() => setActive(!active)}>
            {active ? <BiMenu size={30} /> : <BiXCircle size={30} />}
          </button>
        </div>
        <div
          className={`${
            active ? `hidden` : ``
          } justify-between items-center w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0  text-xl text-primary">
            <li className="py-2 md:py-0">
              <Link href="/explore">
                <div className="text-white px-4 font-bold  hover:text-white cursor-pointer">
                  Explore
                </div>
              </Link>
            </li>
            <li className="py-2 md:py-0">
              <Link href="/presale">
                <div className="text-white px-4 font-bold  hover:text-white cursor-pointer">
                  Presale
                </div>
              </Link>
            </li>
            <li className="py-2 md:py-0">
              <Link href="/create-nft">
                <div className="text-white px-4 font-bold  hover:text-white cursor-pointer">
                  Mint
                </div>
              </Link>
            </li>
            <li className="py-2 md:py-0">
              <Link href="/my-nfts">
                <div className="text-white px-4 font-bold  hover:text-white cursor-pointer">
                  My NFTs
                </div>
              </Link>
            </li>
            <li className="py-2 md:py-0">
              <Link href="/marketplace-conf">
                <div className="text-white px-4 font-bold  hover:text-white cursor-pointer">
                  Config
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
