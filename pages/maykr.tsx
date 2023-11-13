import React, { useState, useEffect, useRef } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import { uploadToNftStorage } from "@/utils/uploadToNftStorage"
import { deleteFromNftStorage } from "@/utils/deleteFromNftStorage"
import html2canvas from "html2canvas"
import download from "downloadjs"
import Creation from "@/styles/Creation.module.css"
import contract from "@/contracts/DigitalRightsMaykr.json"
import hashCreator from "@/utils/artHasher"
import Gallery from "@/styles/Gallery.module.css"

export default function Maykr() {
    const { isWeb3Enabled, account } = useMoralis()
    const [art, setArt] = useState<string>("")
    const [author, setAuthor] = useState<string>("")
    const [co_author, setCoAuthor] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    /* @ts-ignore */
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const containerRef = useRef<HTMLInputElement | null>(null)

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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleEmittedCertsCounter = async () => {
        /** @dev Wallet has to be connected to get below associated with -> isWeb3Enabled check */
        const getAmount = ((await emittedCount()) as string).toString()
        console.log(`Emitted Certs Count is: ${getAmount}`)
        setAmount(getAmount)
    }

    const handleGenerateCertificate = async () => {
        setIsLoading(true)
        const certificateContainer = containerRef.current
        // Reset the box shadow before generating the image
        if (certificateContainer) {
            certificateContainer.style.boxShadow = "none"

            const canvas = await html2canvas(certificateContainer)

            // Convert the canvas to a Blob object
            const imageBlob: Blob = await new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob)
                    } else {
                        // Handle the case where resolving blob fails
                        console.log("Unable to create Blob from canvas")
                    }
                }, "image/png")
            })

            // Restore the box shadow after generating the image
            certificateContainer.style.boxShadow = "0 0 20px 6px rgba(100, 79, 46, 0.96)"
            // Pass the image blob to the upload function
            try {
                const { metadata, cid } = await uploadToNftStorage(author, title, description, art, imageBlob, amount)
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
                console.log("NFT Minted Successfully!", metadata, "NFT: ", amount)
            } catch (error) {
                console.error("Error uploading to NFT.storage:", error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleDownloadCertificate = async () => {
        const container = containerRef.current
        // Remove the box shadow temporarily before generating the image
        if (container) {
            container.style.boxShadow = "none"

            html2canvas(container)
                .then((canvas) => {
                    // Restore the box shadow after generating the image
                    container.style.boxShadow = "0 0 20px 6px rgba(100, 79, 46, 0.96)"

                    canvas.toBlob((blob) => {
                        if (blob) {
                            download(blob, `Certificate_Id_${amount}`)
                        } else {
                            console.error("Error generating certificate image: Blob is null")
                        }
                    })
                })
                .catch((error) => {
                    console.error("Error generating certificate image:", error)
                })
        }
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

    async function handleMintError(cid: string) {
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
        const fetchData = async () => {
            if (isWeb3Enabled) {
                await handleEmittedCertsCounter()
            }
        }

        fetchData()
    }, [isWeb3Enabled, amount])

    return (
        <div>
            {!isWeb3Enabled ? (
                <p className={Gallery.info}>Connect Your Wallet To See Certificates</p>
            ) : (
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
                        <input
                            type="text"
                            className={Creation.inputBox}
                            id="description"
                            name="description"
                            placeholder="Description"
                            onChange={handleInputChange}
                        />
                        <button className={combinedSipnner} onClick={handleGenerateCertificate} disabled={isLoading}>
                            {isLoading ? <div className={Creation.waitSpinner}></div> : "Mint NFT"}
                        </button>
                    </div>
                    {/* Certificate will show only if we have "art" field filled */}
                    {!art && <p className={Creation.magicText}>Magic Will Be Happening Here...</p>}
                    {art && (
                        <div className={Creation.certPositioning}>
                            <div
                                ref={containerRef}
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
                                        <div className={Creation.certText}>
                                            Co-Author
                                            <p className={Creation.certInputText}>
                                                <span>{co_author}</span>
                                            </p>
                                        </div>
                                    )}
                                    <div className={Creation.certText}>
                                        Title
                                        <p className={Creation.certInputText}>
                                            <span>{title}</span>
                                        </p>
                                    </div>
                                    <div className={Creation.certText}>
                                        Creator Address
                                        <p className={Creation.certInputText}>
                                            <span className={Creation.certInputText} style={{ fontSize: "15px" }}>
                                                {account}
                                            </span>
                                        </p>
                                    </div>
                                    <div className={Creation.certText}>
                                        Art Hash
                                        <p className={Creation.certInputText}>
                                            <span className={Creation.certInputText} style={{ fontSize: "14px" }}>
                                                {art}
                                            </span>
                                        </p>
                                    </div>
                                    <p className={Creation.certText}>Certificate_Id_{amount}</p>
                                    <div className={Creation.certText}>
                                        Description{" "}
                                        <p className={Creation.certInputText}>
                                            <span className={Creation.certInputText}>{description}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button className={disableGlow} onClick={handleDownloadCertificate}>
                                Download Certificate
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
