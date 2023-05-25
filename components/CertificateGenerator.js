import React from "react"
import html2canvas from "html2canvas"
import download from "downloadjs"

class CertificateGenerator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            author: "",
            address: "",
            description: "",
            imageUrl: "",
        }
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleGenerateCertificate = () => {
        const { author, address, description } = this.state
        const container = document.getElementById("certificate-container")

        html2canvas(container)
            .then((canvas) => {
                const dataUrl = canvas.toDataURL("image/png")
                this.setState({ imageUrl: dataUrl })
            })
            .catch((error) => {
                console.error("Error generating certificate image:", error)
            })
    }

    handleDownloadCertificate = () => {
        const { author, address, description } = this.state
        const container = document.getElementById("certificate-container")

        html2canvas(container)
            .then((canvas) => {
                canvas.toBlob((blob) => {
                    download(blob, "certificate.png")
                })
            })
            .catch((error) => {
                console.error("Error generating certificate image:", error)
            })
    }

    render() {
        const { imageUrl } = this.state
        return (
            <div>
                <input type="text" name="author" placeholder="Author" onChange={this.handleInputChange} />
                <input type="text" name="address" placeholder="Address" onChange={this.handleInputChange} />
                <input type="text" name="description" placeholder="Description" onChange={this.handleInputChange} />
                <button onClick={this.handleGenerateCertificate}>Generate Certificate</button>
                <div
                    id="certificate-container"
                    style={{
                        position: "relative",
                        width: "840px",
                        height: "1188px",
                        background: `url('/certificate-template.png')`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
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
                        <p style={{ marginBottom: "10px" }}>Author: {this.state.author}</p>
                        <p style={{ marginBottom: "10px" }}>Address: {this.state.address}</p>
                        <p>Description: {this.state.description}</p>
                    </div>
                </div>
                {imageUrl && (
                    <div>
                        <img src={imageUrl} alt="Generated Certificate" />
                        <button onClick={this.handleDownloadCertificate}>Download</button>
                    </div>
                )}
            </div>
        )
    }
}

export default CertificateGenerator
