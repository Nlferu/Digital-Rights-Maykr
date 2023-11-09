import { NFTStorage, File } from "nft.storage"

export default async function uploadToNftStorage(author, title, description, art, imageBlob, index) {
    const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY
    const client = new NFTStorage({ token: NFT_STORAGE_KEY })

    const accounts = await ethereum.request({ method: "eth_accounts" })
    const address = accounts.toString()

    const timeStamp = new Date()
    const creationDate = timeStamp.toString()
    const imageFile = new File([imageBlob], `Certificate_Id_${index}.png`, { type: "image/png" })

    try {
        const response = await client.store({
            name: `Certificate_Id_${index}`,
            author: author,
            title: title,
            address: address,
            description: description,
            date: creationDate,
            hash: art,
            image: imageFile,
        })

        const cid = response.ipnft
        const metadata = `https://ipfs.io/ipfs/${response.ipnft}/metadata.json`
        const imgUrl = response.data.image.toString().replace("ipfs://", "https://ipfs.io/ipfs/")
        console.log(`Metadata: ${metadata} Image URL: ${imgUrl}`)

        return { metadata: metadata, cid: cid }
    } catch (error) {
        console.error("Error uploading to NFT.storage:", error)
        throw error
    }
}
