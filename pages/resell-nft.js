/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import Web3Modal from "web3modal";

import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import PixionGamesToken from "../artifacts/contracts/PGToken.sol/PixionGamesToken.json";

export default function ResellNFT() {
  const marketplaceAddress = process.env.MARKETPLACE_ADDRESS;
  const pixionGamesTokenAddress = process.env.NFT_ADDRESS;
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const { image, price } = formInput;

  useEffect(() => {
    fetchNFT();
  }, [id]);

  async function fetchNFT() {
    if (!tokenURI) return;
    const meta = await axios.get(tokenURI);
    updateFormInput((state) => ({ ...state, image: meta.data.image }));
  }

  async function listNFTForSale() {
    if (!price) return;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");
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

    let transaction = await contract.resellToken(id, priceFormatted, {
      value: listingPrice,
    });
    await transaction.wait();

    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        {image && <Image className="rounded mt-4" width="350" src={image} />}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
