import React from "react"
import html2canvas from "html2canvas"
import download from "downloadjs"
import Certificate from "../styles/Certificate.module.css"
import { uploadToNftStorage } from "../utils/uploadToNftStorage"

class CertificateGenerator extends React.Component {
    state = {
        author: "",
        address: "",
        description: "",
    }

    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    handleGenerateCertificate = () => {
        const certificateContainer = document.getElementById("certificate-container")
        html2canvas(certificateContainer).then((canvas) => {
            const imageData = canvas.toDataURL("image/png")

            // Make the API call to upload the image data to NFT.storage
            uploadToNftStorage(imageData)
                .then((response) => {
                    console.log("Upload successful:", response)
                    // Handle the response as needed
                })
                .catch((error) => {
                    console.error("Error uploading to NFT.storage:", error)
                    // Handle the error as needed
                })
        })
    }

    render() {
        const { author, address, description } = this.state

        return (
            <div>
                <div className={Certificate.inputsContainer}>
                    <input type="text" name="author" placeholder="Author" onChange={this.handleInputChange} />
                    <input type="text" name="address" placeholder="Address" onChange={this.handleInputChange} />
                    <input type="text" name="description" placeholder="Description" onChange={this.handleInputChange} />
                    <button className={Certificate.generateButton} onClick={this.handleGenerateCertificate}>
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
}

export default CertificateGenerator
