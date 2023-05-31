import { useWeb3Contract, useMoralis } from "react-moralis"
import React, { useState } from "react"
import html2canvas from "html2canvas"
import download from "downloadjs"
import Certificate from "../styles/Certificate.module.css"
import uploadToNftStorage from "../utils/uploadToNftStorage"
import contract from "../contracts/DigitalRightsMaykr.json"
import hashCreator from "../utils/artHasher"

const CertificateGenerator = () => {
    const { account } = useMoralis()
    const [art, setArt] = useState("")
    const [author, setAuthor] = useState("")
    const [co_author, setCoAuthor] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const { runContractFunction } = useWeb3Contract()

    const combinedClasses = `${Certificate.generateButton} ${Certificate.downloadButton}`

    const contractAddress = contract.address
    const abi = contract.abi

    const { runContractFunction: emittedCount } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "emittedCount",
        params: {},
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target

        if (name === "art") {
            setArt(value)
        } else if (name === "author") {
            setAuthor(value)
        } else if (name === "co_author") {
            setCoAuthor(value)
        } else if (name === "title") {
            setTitle(value)
        } else if (name === "description") {
            setDescription(value)
        }
    }

    const handleGenerateCertificate = async () => {
        const certificateContainer = document.getElementById("certificate-container")
        const canvas = await html2canvas(certificateContainer)
        const index = (await emittedCount()).toString()

        // Convert the canvas to a Blob object
        const imageBlob = await new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob)
            }, "image/png")
        })

        // Pass the image blob to the upload function
        try {
            const tokenURI = await uploadToNftStorage(art, imageBlob, index)
            console.log("NFT.storage response:", tokenURI)

            console.log("Minting NFT...")
            const mintNft = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "mintNFT",
                params: {
                    createdTokenURI: tokenURI,
                },
            }

            await runContractFunction({
                params: mintNft,
                onError: console.log("error RR"), // () => handleMintError()
                onSuccess: console.log("success RR"), // () => handleMintSuccess()
            })
            console.log("NFT Minted Successfully!")
        } catch (error) {
            console.error("Error uploading to NFT.storage:", error)
        }
    }

    const handleDownloadCertificate = async () => {
        const container = document.getElementById("certificate-container")
        const index = (await emittedCount()).toString()

        // Remove the box shadow temporarily before generating the image
        container.style.boxShadow = "none"

        html2canvas(container)
            .then((canvas) => {
                // Restore the box shadow after generating the image
                container.style.boxShadow = "0 0 20px 6px rgba(100, 79, 46, 0.96)"

                canvas.toBlob((blob) => {
                    download(blob, `Certificate_Id_${index}`)
                })
            })
            .catch((error) => {
                console.error("Error generating certificate image:", error)
            })
    }

    return (
        <div>
            <div className={Certificate.inputsContainer}>
                <input
                    type="file"
                    style={{ color: "white" }}
                    className={Certificate.inputBox}
                    id="art"
                    name="art"
                    placeholder="Art Hash"
                    onChange={() => hashCreator(setArt)}
                />
                <input type="text" className={Certificate.inputBox} id="author" name="author" placeholder="Author" onChange={handleInputChange} />
                <input type="text" className={Certificate.inputBox} id="co_author" name="co_author" placeholder="Co-Author" onChange={handleInputChange} />
                <input type="text" className={Certificate.inputBox} id="title" name="title" placeholder="Title" onChange={handleInputChange} />
                <input
                    type="text"
                    className={Certificate.inputBox}
                    id="description"
                    name="description"
                    placeholder="Description"
                    onChange={handleInputChange}
                />
                <button className={Certificate.generateButton} onClick={handleGenerateCertificate}>
                    Create NFT
                </button>
            </div>
            {/* Certificate will show only if we have "art" field filled */}
            {!art && <p className={Certificate.magicText}>Magic Will Be Happening Here...</p>}
            {art && (
                <div className={Certificate.certPositioning}>
                    <div
                        id="certificate-container"
                        style={{
                            position: "relative",
                            width: "504px",
                            height: "712.8px",
                            background: `url('/certificate-template.png')`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            boxShadow: "0 0 20px 6px rgba(100, 79, 46, 0.96)",
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
                            <p className={Certificate.certText} style={{ marginBottom: "0px", marginTop: "80px" }}>
                                Author
                            </p>
                            <p className={Certificate.certInputText}>
                                <span>{author}</span>
                            </p>
                            {co_author && (
                                <p className={Certificate.certText}>
                                    Co-Author
                                    <p className={Certificate.certInputText}>
                                        <span>{co_author}</span>
                                    </p>
                                </p>
                            )}
                            <p className={Certificate.certText}>
                                Title
                                <p className={Certificate.certInputText}>
                                    <span>{title}</span>
                                </p>
                            </p>
                            <p className={Certificate.certText}>
                                Creator Address
                                <p className={Certificate.certInputText}>
                                    <span className={Certificate.certInputText} style={{ fontSize: "15px" }}>
                                        {account}
                                    </span>
                                </p>
                            </p>
                            <p className={Certificate.certText}>
                                Art Hash
                                <p className={Certificate.certInputText}>
                                    <span className={Certificate.certInputText} style={{ fontSize: "14px" }}>
                                        {art}
                                    </span>
                                </p>
                            </p>
                            <p className={Certificate.certText}>
                                Description{" "}
                                <p className={Certificate.certInputText}>
                                    <span className={Certificate.certInputText}>{description}</span>
                                </p>
                            </p>
                        </div>
                    </div>
                    <button className={combinedClasses} onClick={handleDownloadCertificate}>
                        Download Certificate
                    </button>
                </div>
            )}
        </div>
    )
}

export default CertificateGenerator
