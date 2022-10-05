import { useState,useEffect } from 'react';
import Button from './Button'
import { BiHeart } from 'react-icons/bi'
import data from '../../data/item-nft.json'
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import axios from 'axios';
import NFTCards from "../NFTCards";


export default function Collections() {
  const marketplaceAddress = process.env.MARKETPLACE_ADDRESS;
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

    const data = await marketplaceContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        console.log("Item price:", price);
        let item = {
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

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      signer,
    )

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    })
    await transaction.wait()
    loadNFTs()
  }
  return (
    <>
      <div
        className="container mx-auto py-4 md:py-20 px-3 md:px-0"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        <div className="flex justify-between items-center">
          <h1 className="font-primary  font-bold text-3xl md:text-5xl text-transparent  bg-clip-text bg-gradient-to-r from-purple-600 to-pink-400 mb-4">
            Hot Drops
          </h1>
          <Button text="View More" variant="secondary" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {nfts.map((item, index) => {
            return (
              <div key={index} className="flex flex-wrap ">
              {nfts.map((nftItem, id) => (
                <NFTCards key={id} nftItem={nftItem} loadNFTs={loadNFTs} />
              ))}
            </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
