require("dotenv").config()

module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ipfs.io",
                pathname: "**",
            },
        ],
    },
    env: {
        NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY,
    },
}
