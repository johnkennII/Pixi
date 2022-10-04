/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { ethers } from "ethers";
import Web3 from "web3";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";

import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import PixionGamesToken from "../artifacts/contracts/PGToken.sol/PixionGamesToken.json";

export default function MyAssets() {
  const marketplaceAddress = process.env.MARKETPLACE_ADDRESS;
  const pixionGamesTokenAddress = process.env.NFT_ADDRESS;
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
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

    const web3 = new Web3(connection);
    var accounts = await web3.eth.getAccounts();
    const data = await marketplaceContract.fetchUserNFTs(accounts[0]);

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  function listNFT(nft) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;
  return (
    <div
      className="flex justify-center"
      style={{
        background:
          "linear-gradient(125deg, rgb(17, 10, 38), #542167, #34c2ac)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="rounded" />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} Eth
                </p>
                <button
                  className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => listNFT(nft)}
                >
                  List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
