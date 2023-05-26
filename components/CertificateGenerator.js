import React, { useState } from "react"
import html2canvas from "html2canvas"
import download from "downloadjs"
import Certificate from "../styles/Certificate.module.css"
import { uploadToNftStorage } from "../utils/uploadToNftStorage"
import { metadataTemplate } from "../utils/metadata"

const CertificateGenerator = () => {
    const [author, setAuthor] = useState("")
    const [address, setAddress] = useState("")
    const [description, setDescription] = useState("")

    const handleInputChange = (event) => {
        const { name, value } = event.target
        if (name === "author") {
            setAuthor(value)
        } else if (name === "address") {
            setAddress(value)
        } else if (name === "description") {
            setDescription(value)
        }
    }

    const handleGenerateCertificate = async () => {
        const certificateContainer = document.getElementById("certificate-container")
        const canvas = await html2canvas(certificateContainer)

        // Convert the canvas to a Blob object
        const imageBlob = await new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob)
            }, "image/png")
        })

        // Pass the image blob to the upload function
        try {
            const response = await uploadToNftStorage(imageBlob, metadataTemplate)
            console.log("NFT.storage response:", response)
        } catch (error) {
            console.error("Error uploading to NFT.storage:", error)
        }
    }

    return (
        <div>
            <div className={Certificate.inputsContainer}>
                <input type="text" name="author" placeholder="Author" onChange={handleInputChange} />
                <input type="text" name="address" placeholder="Address" onChange={handleInputChange} />
                <input type="text" name="description" placeholder="Description" onChange={handleInputChange} />
                <button className={Certificate.generateButton} onClick={handleGenerateCertificate}>
                    Generate Certificate
                </button>
            </div>
            {author && address && description && (
                <div className={Certificate.certPositioning}>
                    <div
                        id="certificate-container"
                        style={{
                            position: "relative",
                            width: "556px",
                            height: "700px",
                            background: `url('/certificate-template.png')`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                textAlign: "center",
                                color: "white",
                            }}
                        >
                            <p style={{ marginBottom: "10px" }}>Author: {author}</p>
                            <p style={{ marginBottom: "10px" }}>Address: {address}</p>
                            <p>Description: {description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CertificateGenerator
