/* pages/create-nft.js */
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

const infuraGateway = "https://piximarketplace.infura-ipfs.io/ipfs/";

const ipfsClient = require("ipfs-http-client");

const projectId = "2FeElPDGUJeoS8flWKilod6MLgD";
const projectSecretKey = "8fe90752e4f514724cd1cecd9d607a23";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecretKey).toString("base64");

const client = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";

export default function CreateItem() {
  const marketplaceAddress = process.env.MARKETPLACE_ADDRESS;
  const [value, setValue] = useState("default");
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  const router = useRouter();

  async function onChange(e) {
    /* upload image to IPFS */
    console.log("onChange function Uploading to IPFS...");
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://piximarketplace.infura-ipfs.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    console.log("onChange function Uploaded to IPFS!");
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload metadata to IPFS */
    console.log("Uploading to IPFS...");
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://piximarketplace.infura-ipfs.io/ipfs/${added.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    console.log("Uploaded to IPFS!");
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();
    console.log("URL:", url);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* create the NFT */
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      signer
    );

    console.log("Code:", provider.getCode(marketplaceAddress));

    console.log("Marketplace Address", marketplaceContract.address);

    let mintTransaction = await marketplaceContract.createToken(
      url,
      price,
      true
    );

    await mintTransaction.wait();

    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Avax"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />

        <input type="file" name="Asset" className="my-4" onChange={onChange} />

        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create NFT
        </button>
      </div>
    </div>
  );
}
