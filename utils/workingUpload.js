const { imgPath, uploadedImagesURIs, uploadedMetadataURIs } = require("../helper-hardhat-config")
const { NFTStorage, File } = require("nft.storage")
const mime = require("mime")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */
async function storeNFTs(imagesPath) {
    console.log("Uploading Images and Metadata To NFT.Storage...")
    const fullImagesPath = path.resolve(imagesPath)
    const files = fs.readdirSync(fullImagesPath)
    let metadataArray = []
    let imgArray = []
    let responses = []
    for (fileIndex in files) {
        const image = await fileFromPath(`${fullImagesPath}/${files[fileIndex]}`)
        const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

        const artName = files[fileIndex].replace(".png", "")
        const timeStamp = new Date()
        const creationDate = timeStamp.toString()

        const response = await nftstorage.store({
            image,
            name: artName,
            description: `Some Certificate Description ${artName}`,
            hash: "",
            author: "Melani Parker",
            address: "",
            date: creationDate,
            certificate: "hash+tokenId(name)",
        })
        metadataArray.push(`https://ipfs.io/ipfs/${response.ipnft}/metadata.json` + "\n")
        imgArray.push(`${response.data.image.toString().replace("ipfs://", "https://ipfs.io/ipfs/")}` + "\n")
        // Saving generated metadata and images URIs in correct files, without any ","
        fs.writeFileSync(uploadedImagesURIs, imgArray.toString().replace(/,/g, ""))
        fs.writeFileSync(uploadedMetadataURIs, metadataArray.toString().replace(/,/g, ""))
        //responses.push(response)
    }
    return metadataArray
}

/**
 * A helper to read a file from a location on disk and return a File object.
 * Note that this reads the entire file into memory and should not be used for
 * very large files.
 * @param {string} filePath the path to a file to store
 * @returns {File} a File object containing the file content
 */
async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}

// storeNFTs(imgPath)
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })

module.exports = { storeNFTs }
