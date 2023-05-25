import React from "react"
import htmlToImage from "html-to-image"
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

        htmlToImage
            .toPng(container)
            .then((dataUrl) => {
                this.setState({ imageUrl: dataUrl })
            })
            .catch((error) => {
                console.error("Error generating certificate image:", error)
            })
    }

    handleDownloadCertificate = () => {
        const { author, address, description } = this.state
        const container = document.getElementById("certificate-container")

        htmlToImage
            .toBlob(container)
            .then((blob) => {
                download(blob, "certificate.png")
            })
            .catch((error) => {
                console.error("Error generating certificate image:", error)
            })
    }

    render() {
        return (
            <div>
                <input type="text" name="author" placeholder="Author" onChange={this.handleInputChange} />
                <input type="text" name="address" placeholder="Address" onChange={this.handleInputChange} />
                <input type="text" name="description" placeholder="Description" onChange={this.handleInputChange} />
                <button onClick={this.handleGenerateCertificate}>Generate Certificate</button>
                <div id="certificate-container">
                    <p>Author: {this.state.author}</p>
                    <p>Address: {this.state.address}</p>
                    <p>Description: {this.state.description}</p>
                </div>
                {this.state.imageUrl && (
                    <div>
                        <img src={this.state.imageUrl} alt="Generated Certificate" />
                        <button onClick={this.handleDownloadCertificate}>Download</button>
                    </div>
                )}
            </div>
        )
    }
}

export default CertificateGenerator
