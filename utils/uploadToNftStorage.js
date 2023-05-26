import axios from "axios"

// Figure out how to upload it correctly with metadata

async function uploadToNftStorage(imageBlob, metadata) {
    const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY

    try {
        // Create a FormData object and append the image blob and metadata to it
        const formData = new FormData()
        formData.append("file", imageBlob)
        formData.append("metadata", JSON.stringify(metadata))

        // Make a POST request to the NFT.storage API endpoint
        const response = await axios.post("https://api.nft.storage/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                metadata: "Miauka",
                imageBlob,
                metadata,
                Authorization: `Bearer ${NFT_STORAGE_KEY}`,
            },
            metadata: {
                metadta: "hauka",
                metadata,
            },
        })

        return response.data
    } catch (error) {
        console.error("Error uploading to NFT.storage:", error)
        throw error
    }
}

export { uploadToNftStorage }
