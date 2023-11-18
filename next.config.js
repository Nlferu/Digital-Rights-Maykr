require("dotenv").config()

module.exports = {
    images: {
        domains: ["ipfs.io"],
    },
    env: {
        NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY,
    },
}
