import { useWeb3Contract, useMoralis } from "react-moralis"
import React, { useState, useEffect } from "react"
import { useNotification } from "web3uikit"
import html2canvas from "html2canvas"
import download from "downloadjs"
import Creation from "../styles/Creation.module.css"
import uploadToNftStorage from "../utils/uploadToNftStorage"
import deleteFromNftStorage from "../utils/deleteFromNftStorage"
import contract from "../contracts/DigitalRightsMaykr.json"
import hashCreator from "../utils/artHasher"

export default function CreateCertificate() {
    const { isWeb3Enabled, account } = useMoralis()
    const [art, setArt] = useState("")
    const [author, setAuthor] = useState("")
    const [co_author, setCoAuthor] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [id, setId] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const disableGlow = `${Creation.generateButton} ${Creation.downloadButton} ${Creation.disableGlow}`
    const combinedSipnner = `${Creation.generateButton} ${Creation.waitSpinnerCenter}`

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

    const handleCertId = async () => {
        const getIndex = (await emittedCount()).toString()
        setId(getIndex)
    }

    const handleGenerateCertificate = async () => {
        setIsLoading(true)
        const certificateContainer = document.getElementById("certificate-container")
        // Reset the box shadow before generating the image
        certificateContainer.style.boxShadow = "none"
        const canvas = await html2canvas(certificateContainer)
        // To run below wallet has to be connected ERROR HANDLER TO BE ADDED
        const index = (await emittedCount()).toString()
        setId(index)
        // Convert the canvas to a Blob object
        const imageBlob = await new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob)
            }, "image/png")
        })

        // Restore the box shadow after generating the image
        certificateContainer.style.boxShadow = "0 0 20px 6px rgba(100, 79, 46, 0.96)"
        // Pass the image blob to the upload function
        try {
            const { metadata, cid } = await uploadToNftStorage(art, imageBlob, index)
            console.log("NFT.storage response:", metadata)

            console.log("Minting NFT...")
            const mintNft = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "mintNFT",
                params: {
                    createdTokenURI: metadata,
                },
            }

            await runContractFunction({
                params: mintNft,
                onError: () => handleMintError(cid),
                onSuccess: () => handleMintSuccess(),
            })
            console.log("NFT Minted Successfully!", metadata, "NFT: ", index)
        } catch (error) {
            console.error("Error uploading to NFT.storage:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownloadCertificate = async () => {
        const container = document.getElementById("certificate-container")
        // To run below wallet has to be connected ERROR HANDLER TO BE ADDED
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

    async function handleMintSuccess() {
        dispatch({
            type: "success",
            message: "NFT Created!",
            title: "NFT Creation Success",
            position: "bottomR",
            icon: "bell",
        })
        setTimeout(() => {
            location.reload()
        }, 8000)
    }

    async function handleMintError(cid) {
        dispatch({
            type: "error",
            message: "NFT Has Not Been Created",
            title: "NFT Creation Error",
            position: "bottomR",
            icon: "exclamation",
        })
        deleteFromNftStorage(cid)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            handleCertId()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            <div className={Creation.inputsContainer}>
                <input
                    type="file"
                    style={{ color: "white" }}
                    className={Creation.inputBox}
                    id="art"
                    name="art"
                    placeholder="Art Hash"
                    onChange={() => hashCreator(setArt)}
                />
                <input type="text" className={Creation.inputBox} id="author" name="author" placeholder="Author" onChange={handleInputChange} />
                <input type="text" className={Creation.inputBox} id="co_author" name="co_author" placeholder="Co-Author" onChange={handleInputChange} />
                <input type="text" className={Creation.inputBox} id="title" name="title" placeholder="Title" onChange={handleInputChange} />
                <input type="text" className={Creation.inputBox} id="description" name="description" placeholder="Description" onChange={handleInputChange} />
                <button className={combinedSipnner} onClick={handleGenerateCertificate} disabled={isLoading}>
                    {isLoading ? <div className={Creation.waitSpinner}></div> : "Mint NFT"}
                </button>
            </div>
            {/* Certificate will show only if we have "art" field filled */}
            {!art && <p className={Creation.magicText}>Magic Will Be Happening Here...</p>}
            {art && (
                <div className={Creation.certPositioning}>
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
                            <p className={Creation.certText} style={{ marginBottom: "0px", marginTop: "120px" }}>
                                Author
                            </p>
                            <p className={Creation.certInputText}>
                                <span>{author}</span>
                            </p>
                            {co_author && (
                                <p className={Creation.certText}>
                                    Co-Author
                                    <p className={Creation.certInputText}>
                                        <span>{co_author}</span>
                                    </p>
                                </p>
                            )}
                            <p className={Creation.certText}>
                                Title
                                <p className={Creation.certInputText}>
                                    <span>{title}</span>
                                </p>
                            </p>
                            <p className={Creation.certText}>
                                Creator Address
                                <p className={Creation.certInputText}>
                                    <span className={Creation.certInputText} style={{ fontSize: "15px" }}>
                                        {account}
                                    </span>
                                </p>
                            </p>
                            <p className={Creation.certText}>
                                Art Hash
                                <p className={Creation.certInputText}>
                                    <span className={Creation.certInputText} style={{ fontSize: "14px" }}>
                                        {art}
                                    </span>
                                </p>
                            </p>
                            <p className={Creation.certText}>Certificate_Id_{id}</p>
                            <p className={Creation.certText}>
                                Description{" "}
                                <p className={Creation.certInputText}>
                                    <span className={Creation.certInputText}>{description}</span>
                                </p>
                            </p>
                        </div>
                    </div>
                    <button className={disableGlow} onClick={handleDownloadCertificate}>
                        Download Certificate
                    </button>
                </div>
            )}
        </div>
    )
}
