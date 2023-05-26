import { uploadToNftStorage } from "../../utils/uploadToNftStorage"

export default async function handler(req, res) {
    const { imageData } = req.body

    try {
        const response = await uploadToNftStorage(imageData)
        res.status(200).json(response)
    } catch (error) {
        console.error("Error uploading to NFT.storage:", error)
        res.status(500).json({ error: "Error uploading to NFT.storage" })
    }
}
