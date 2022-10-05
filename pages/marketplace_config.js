/* pages/marketplace_config.js */
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";

export default function MarketplaceConfig() {
  const marketplaceAddress = process.env.MARKETPLACE_ADDRESS;
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    startingTime: 0,
    closingTime: 0,
    duration: 0,
  });
  const { startingTime, closingTime, duration } = formInput;
  const [whitelistFormInput, updateWhitelistFormInput] = useState({
    address: 0,
  });

  const { address } = whitelistFormInput;

  const router = useRouter();

  async function WhitelistUser() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* create the NFT */
    const contract = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      signer
    );

    let transaction = await contract.whiteListeNewAddress(address);

    await transaction.wait();
  }

  async function changePresaleTime() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* create the NFT */
    const contract = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      signer
    );

    let transaction = await contract.TimedCrowdsale(
      startingTime,
      closingTime,
      duration
    );

    await transaction.wait();
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <h1>Change Presale Time</h1>
        <input
          placeholder="Presale Starting Timestamp"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, startingTime: e.target.value })
          }
        />
        <textarea
          placeholder="Presale Closing Timestamp"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, closingTime: e.target.value })
          }
        />
        <input
          placeholder="Lock Duration"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, duration: e.target.value })
          }
        />

        <button
          onClick={changePresaleTime}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Set Time
        </button>
      </div>
      <div className="w-1/2 flex flex-col pb-12">
        <h1>Whitelist User</h1>
        <input
          placeholder="Presale Starting Timestamp"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateWhitelistFormInput({ ...formInput, address: e.target.value })
          }
        />

        <button
          onClick={WhitelistUser}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Whitelist User
        </button>
      </div>
    </div>
  );
}
