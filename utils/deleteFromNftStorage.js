import { NFTStorage } from "nft.storage"

export default async function deleteFromNftStorage(cid) {
    const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY
    const client = new NFTStorage({ token: NFT_STORAGE_KEY })

    await client.delete(cid)
    console.log(`CID: ${cid} deleted successfully!`)
}
