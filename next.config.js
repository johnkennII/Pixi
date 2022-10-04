/** @type {import('next').NextConfig} */
require("dotenv").config();
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  nextConfig,
  env: {
    MARKETPLACE_ADDRESS: process.env.MARKETPLACE_ADDRESS,
    NFT_ADDRESS: process.env.NFT_ADDRESS,
    PRESALE_ADDRESS: process.env.PRESALE_ADDRESS,
    INFURAPROJECTID: process.env.INFURAPROJECTID,
    INFURAAPIKEYSECRET: process.env.INFURAAPIKEYSECRET,
  },
};
