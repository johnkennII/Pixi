/* pages/marketplace_config.js */
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";

var options = [];
options.push(
  {
    value: 0x0000000000000000000000000000000000000000000000000000000000000000,
    label: "ADMIN",
  },
  {
    value: 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6,
    label: "MINTER",
  },
  {
    value: 0x8f3e3ec85be8136ab597ba63347c6a7b5ee4354f5c67cfa9fe9fc93392fd3b0d,
    label: "SUPER",
  }
);

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

  const [permissionFormInput, updatePermissionFormInput] = useState({
    permissionedAddress: 0,
    permission: 0,
  });
  const { permissionedAddress, permission } = permissionFormInput;

  const router = useRouter();

  async function GrantPermission() {
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

    let transaction = await contract.grantRole(permission, permissionedAddress);
    await transaction.wait();
  }

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
    <div className=" bg-gray-600 flex flex-col justify-center items-center">
      <div className="w-1/2 flex flex-col pb-12">
        <h1 className="text-white font-extrabold text-2xl mt-5">Change Presale Time</h1>
        <input
          placeholder="Presale Starting Timestamp"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, startingTime: e.target.value })
          }
        />
        <input
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
        <h1 className="text-white font-extrabold text-2xl">Whitelist User</h1>
        <input
          placeholder="User Address"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateWhitelistFormInput({
              ...whitelistFormInput,
              address: e.target.value,
            })
          }
        />

        <button
          onClick={WhitelistUser}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Whitelist User
        </button>
      </div>
      <div className="w-1/2 flex flex-col pb-12">
        <h1 className="text-white font-extrabold text-2xl">Permissions</h1>
        <input
          placeholder="User Address"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updatePermissionFormInput({
              ...permissionFormInput,
              permissionedAddress: e.target.value,
            })
          }
        />
        <div className="inline-flex mt-2 appearance-none">
          <select
            className="form-select 
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding bg-no-repeat
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            onChange={(e) =>
              updatePermissionFormInput({
                ...permissionFormInput,
                collection: e.target.options.selectedIndex,
              })
            }
          >
            <option className="text-gray-50" value="default" disabled hidden>
              Choose Role
            </option>
            {options.map((option) => (
              <option key={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={GrantPermission}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Grant Permission
        </button>
      </div>
    </div>
  );
}
