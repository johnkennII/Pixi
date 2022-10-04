import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useWeb3 } from "@3rdweb/hooks";
import LandingHeader from "../components/landin_header.js";
import Web3Modal from "web3modal";
import NFTCards from "../components/NFTCards";

import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import PixionGamesToken from "../artifacts/contracts/PGToken.sol/PixionGamesToken.json";

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl justify-center align-middle font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
};

export default function Explore() {
  const marketplaceAddress = process.env.MARKETPLACE_ADDRESS;
  const pixionGamesTokenAddress = process.env.NFT_ADDRESS;
  const { address, connectWallet } = useWeb3();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
    // console.log("address", address);
  }, []);

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      provider
    );
    const pixionGamesTokenContract = new ethers.Contract(
      pixionGamesTokenAddress,
      PixionGamesToken.abi,
      provider
    );
    const data = await marketplaceContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await pixionGamesTokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          itemId: i.itemId.toNumber(),
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          nftContract: i.nftContract,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        console.log("NFT Items:", item);
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <div>
        {address ? (
          <>
            <LandingHeader />
            <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
          </>
        ) : (
          <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
        )}
      </div>
    );
  return (
    <div className={style.wrapper}>
      {address ? (
        <>
          <LandingHeader />
          <div>
            <h2 className="text-white px-20 py-10 text-3xl justify-center">
              All Collections
            </h2>
            <div>
              <div className="flex flex-wrap ">
                {nfts.map((nftItem, id) => (
                  <NFTCards key={id} nftItem={nftItem} loadNFTs={loadNFTs} />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={style.walletConnectWrapper}>
          <button
            className={style.button}
            onClick={() => connectWallet("injected")}
          >
            Connect Wallet
          </button>
          <div className={style.details}>
            You Need Chrome to be able to run this
          </div>
        </div>
      )}
    </div>
  );
}
