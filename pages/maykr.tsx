import React, { useState, useEffect, useRef } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import { uploadToNftStorage } from "@/utils/uploadToNftStorage"
import { deleteFromNftStorage } from "@/utils/deleteFromNftStorage"
import contract from "@/contracts/DigitalRightsMaykr.json"
import html2canvas from "html2canvas"
import download from "downloadjs"
import hashCreator from "@/utils/artHasher"
import Button from "@/components/button"

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
            certificateContainer.style.boxShadow = "0px 0px 25px rgba(253, 253, 253, 0.8)"
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
                    container.style.boxShadow = "0px 0px 25px rgba(253, 253, 253, 0.8)"

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
                <div className="flex flex-col text-center mt-[20rem]">
                    <p className="bg-gradient-to-r from-pink-400 via-pink-500 to-indigo-600 inline-block text-transparent bg-clip-text text-6xl font-bold">
                        Connect Your Wallet To Create Certificate
                    </p>
                </div>
            ) : (
                <div className="flex justify-center items-center ml-[10rem] gap-[5rem]">
                    <div className="w-1/2 mt-[15rem]">
                        <div className="flex flex-col gap-3 w-[16rem]">
                            <input
                                type="file"
                                style={{ color: "white" }}
                                className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center cursor-pointer"
                                id="art"
                                name="art"
                                placeholder="Art Hash"
                                onChange={() => hashCreator(setArt)}
                            />
                            <input
                                type="text"
                                className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center text-gray-300 focus:text-gray-300 placeholder:text-gray-100"
                                id="author"
                                name="author"
                                placeholder="Author"
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center text-gray-300 focus:text-gray-300 placeholder:text-gray-100"
                                id="co_author"
                                name="co_author"
                                placeholder="Co-Author"
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center text-gray-300 focus:text-gray-300 placeholder:text-gray-100"
                                id="title"
                                name="title"
                                placeholder="Title"
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center text-gray-300 focus:text-gray-300 placeholder:text-gray-100"
                                id="description"
                                name="description"
                                placeholder="Description"
                                onChange={handleInputChange}
                            />

                            <Button name="Mint NFT" onClick={handleGenerateCertificate} disabled={isLoading} />
                        </div>
                    </div>
                    {/* Certificate will show only if we have "art" field filled */}
                    {!art && (
                        <div className="flex text-center justify-end h-[10rem] mr-[6rem] mt-auto">
                            <p className="bg-gradient-to-r from-pink-400 via-pink-500 to-indigo-600 inline-block text-transparent bg-clip-text text-4xl font-bold">
                                Magic Will Be Happening Here...
                            </p>
                        </div>
                    )}
                    {art && (
                        <div className="flex flex-col text-center justify-end mr-[6rem] mt-[4rem]">
                            <div
                                ref={containerRef}
                                id="certificate-container"
                                style={{
                                    position: "relative",
                                    width: "28.28rem",
                                    height: "40rem",
                                    background: `url('/certificate-template.png')`,
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    boxShadow: "0px 0px 25px rgba(253, 253, 253, 0.8)",
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
                                    <p className="text-certH text-xl mt-3">Author</p>
                                    <p className="text-certL text-sm mt-1">
                                        <span>{author}</span>
                                    </p>
                                    {co_author && (
                                        <div className="text-certH text-xl">
                                            Co-Author
                                            <p className="text-certL text-sm mt-1">
                                                <span>{co_author}</span>
                                            </p>
                                        </div>
                                    )}
                                    <div className="text-certH text-xl">
                                        Title
                                        <p className="text-certL text-sm mt-1">
                                            <span>{title}</span>
                                        </p>
                                    </div>
                                    <div className="text-certH text-xl">
                                        Creator Address
                                        <p className="text-certL text-sm mt-1">
                                            <span className="text-certL text-sm mt-1">{account}</span>
                                        </p>
                                    </div>
                                    <div className="text-certH text-xl">
                                        Art Hash
                                        <p className="text-certL text-sm mt-1">
                                            <span className="text-certL text-sm mt-1">{art}</span>
                                        </p>
                                    </div>
                                    <p className="text-certH text-xl">Certificate_Id_{amount}</p>
                                    <div className="text-certH text-xl">
                                        Description{" "}
                                        <p className="text-certL text-sm mt-1">
                                            <span className="text-certL text-sm mt-1">{description}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button name="Download Certificate" onClick={handleDownloadCertificate} />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
