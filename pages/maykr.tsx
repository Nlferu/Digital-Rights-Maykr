import React, { useState, useRef } from "react"
import { useNotification } from "web3uikit"
import { uploadToNftStorage } from "@/utils/uploadToNftStorage"
import { deleteFromNftStorage } from "@/utils/deleteFromNftStorage"
import { Button } from "@/components/button"
import { inputs } from "@/lib/data"
import { useSectionInView } from "@/lib/hooks"
import maykr from "@/contracts/DigitalRightsMaykr.json"
import html2canvas from "html2canvas"
import download from "downloadjs"
import hashCreator from "@/utils/artHasher"
import { BigNumber, ethers } from "ethers"
import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react"

import { useConnectionStatus } from "@thirdweb-dev/react"

export default function Maykr() {
    const { ref } = useSectionInView("Maykr", 0.5)
    // Create object for below
    const [art, setArt] = useState<string>("")
    const [author, setAuthor] = useState<string>("")
    const [co_author, setCoAuthor] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [isMinting, setIsMinting] = useState<boolean>(false)
    // This to be replaced
    const dispatch = useNotification()

    const account = useAddress()
    const connectionStatus = useConnectionStatus()

    const containerRef = useRef<HTMLInputElement | null>(null)

    const contractAddress = maykr.address
    const abi = maykr.abi

    const { contract } = useContract(contractAddress, abi)
    //const { data, isLoading, error } = useContractRead(contract, "emittedCount")
    const emitted = useContractRead(contract, "emittedCount")
    const proceeds = useContractRead(contract, "getProceeds", [account])
    if (emitted.error) {
        console.error("Failed to read contract", emitted.error)
    }
    if (emitted.data) {
        console.log("Emitted Certs Amount: ", emitted.data.toNumber(), emitted.isLoading)
        console.log("Proceeds ", parseFloat(ethers.utils.formatEther(proceeds.data as BigNumber)))
    }

    //const { mutateAsync, isLoading, error } = useContractWrite(contract, "mintNFT")
    const handleMint = useContractWrite(contract, "mintNFT")

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

    const handleGenerateCertificate = async () => {
        setIsMinting(true)

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
            //try {
            if (author && title && description && art && imageBlob && emitted.data.toNumber()) {
                const { metadata, cid } = await uploadToNftStorage(author, title, description, art, imageBlob, emitted.data.toNumber())
                console.log("NFT.storage response:", metadata)

                if (metadata) {
                    try {
                        await handleMint.mutateAsync({ args: [metadata] })
                        handleMintSuccess()
                    } catch (error) {
                        console.log("Holy Lama Occured")
                        handleMintError(cid)
                    } finally {
                        setIsMinting(false)
                    }
                } else {
                    console.log("No metadata available")
                }
            } else {
                console.log("Fill all the fields")
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
                            download(blob, `Certificate_Id_${emitted.data.toNumber()}`)
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

    return (
        <div ref={ref}>
            {connectionStatus !== "connected" ? (
                <div className="flex flex-col text-center items-center justify-center mt-[20rem] mb-0 sm:mb-[17.5rem]">
                    <p className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-6xl font-bold h-[20rem] sm:h-[11rem]">
                        Connect Your Wallet To Create Certificate
                    </p>
                </div>
            ) : (
                <div className="flex items-center lg:pl-[14rem] mr-[-1rem] lg:pr-[-10rem] h-[45rem] mt-[3.5rem] gap-20 px-[1rem] mb-[-4rem] lg:mb-0">
                    <div className="flex mt-[4.5rem] justify-center">
                        <div className="flex flex-col gap-3 w-[16rem] self-center">
                            <input
                                type="file"
                                style={{ color: "white" }}
                                className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center cursor-pointer"
                                id="art"
                                name="art"
                                placeholder="Art Hash"
                                onChange={() => hashCreator(setArt)}
                            />

                            {inputs.map((input) => (
                                <input
                                    className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center text-gray-300 focus:text-gray-300 placeholder:text-gray-100"
                                    key={input.name}
                                    type={input.type}
                                    name={input.name}
                                    id={input.name}
                                    placeholder={input.placeholder}
                                    onChange={handleInputChange}
                                ></input>
                            ))}
                            <Button name="Mint NFT" onClick={handleGenerateCertificate} disabled={isMinting} />
                        </div>
                    </div>
                    {/* Certificate will show only if we have "art" field filled */}
                    {!art && (
                        <div className="lg:flex hidden text-center justify-end pl-[10rem] pr-[10rem] mt-[4.5rem]">
                            <p className="h-[10rem] bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-4xl font-bold self-center">
                                Magic Will Be Happening Here...
                            </p>
                        </div>
                    )}
                    {art && (
                        <div className="lg:flex hidden flex-col text-center justify-end xl:pl-[15rem] pl:[2rem] pr-[14rem] mt-[2rem]">
                            <div
                                ref={containerRef}
                                id="certificate-container"
                                style={{
                                    position: "relative",
                                    width: "28rem",
                                    height: "39.6rem",
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
                                            <span className="text-certL text-xs mt-1">{art}</span>
                                        </p>
                                    </div>
                                    <p className="text-certH text-xl">Certificate_Id_{emitted.data.toNumber()}</p>
                                    <div className="text-certH text-xl">
                                        Description{" "}
                                        <p className="text-certL text-sm mt-1">
                                            <span className="text-certL text-sm mt-1">{description}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button name="Download" onClick={handleDownloadCertificate} />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
