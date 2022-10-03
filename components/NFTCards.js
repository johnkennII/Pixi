import React from "react";
import Image from "next/image";
import { BiHeart } from "react-icons/bi";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/Marketplace.sol/NFTMarketplace.json";


const NFTCards = ({ nftItem, loadNFTs }) => {
  const router = useRouter();

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }
  return (
    <div className="bg-[#303339] w-[15rem] h-[24rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer">
      <div className="h-2/3 w-full overflow-hidden flex justify-center items-center">
        <Image src={nftItem.image} alt="" />
      </div>
      <div className="w-full flex justify-center text-white">
        <Image
          className="w-10 h-10 object-cover rounded-full border-2 border-[#202225] mt-[-1rem]"
          src={
            nftItem?.authorImg
              ? nftItem.authorImg
              : "https://dailygazette.com/wp-content/uploads/fly-images/132597/APTOPIX_Bitcoin_Found_ONe-scaled-940x940.jpg"
          }
        
          />
      </div>
      <div className="p-3 mt-[-1rem]">
        <div className="flex justify-between text-[#e4e8eb] drop-shadow-xl">
          <div className="flex-0.6 flex-wrap">
            <div className="font-semibold text-sm text-[#8a939b]">{nftItem.collection}</div>
            <div className="font-bold text-lg mt-2">{nftItem.name}</div>
            <div>
              <button
                className="flex mt-3 items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => buyNFT(nftItem)}
              >
                Buy
              </button>
            </div>
          </div>
          <div className="flex-0.4 text-right">
            <div className="font-semibold text-sm text-[#8a939b]">Price</div>
            <div className="flex items-center text-xl font-bold mt-2">
              <Image
                src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                alt="eth"
                className="h-5 mr-2"
              />
              {nftItem.price}
            </div>
            <div className="text-[#8a939b] font-bold flex items-center w-full justify-end mt-4">
              <span className="text-xl mr-2">
                <BiHeart />
              </span>{" "}
              {nftItem.likes ? nftItem.likes : "12"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCards;
