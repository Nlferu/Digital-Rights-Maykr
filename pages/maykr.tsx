import React, { useState, useRef } from "react"
import { useNotification } from "web3uikit"
import { uploadToNftStorage } from "@/utils/uploadToNftStorage"
import { deleteFromNftStorage } from "@/utils/deleteFromNftStorage"
import { Button } from "@/components/button"
import { inputs } from "@/lib/data"
import { useSectionInView } from "@/lib/hooks"
import { useAddress, useContract, useContractRead, useContractWrite, useConnectionStatus } from "@thirdweb-dev/react"
import maykr from "@/contracts/DigitalRightsMaykr.json"
import html2canvas from "html2canvas"
import download from "downloadjs"
import hashCreator from "@/utils/artHasher"

export default function Maykr() {
    const { ref } = useSectionInView("Maykr", 0.5)
    const [form, setForm] = useState({
        art: "",
        author: "",
        co_author: "",
        title: "",
        description: "",
    })
    const [isMinting, setIsMinting] = useState<boolean>(false)

    // This to be replaced
    const dispatch = useNotification()

    const account = useAddress()
    const connectionStatus = useConnectionStatus()

    const containerRef = useRef<HTMLInputElement | null>(null)

    const contractAddress = maykr.address
    const abi = maykr.abi

    const { contract } = useContract(contractAddress, abi)
    //const { data: emitted, isLoading, error } = useContractRead(contract, "emittedCount")
    const emitted = useContractRead(contract, "emittedCount")

    if (emitted.error) {
        console.error("Failed to read contract", emitted.error)
    }
    if (emitted.data) {
        console.log("Emitted Certs Amount: ", emitted.data.toNumber(), emitted.isLoading)
    }

    //const { mutateAsync, isLoading, error } = useContractWrite(contract, "mintNFT")
    const handleMint = useContractWrite(contract, "mintNFT")

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setForm({
            ...form,
            [name]: value,
        })
    }

    const handleGenerateCertificate = async () => {
        if (connectionStatus === "connected") {
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
                certificateContainer.style.boxShadow = "0px 0px 25px 15px rgba(3, 3, 3, 1)"
                // Pass the image blob to the upload function
                if (form.author && form.title && form.description && form.art && imageBlob && emitted.data.toNumber() >= 0) {
                    const { metadata, cid } = await uploadToNftStorage(form.author, form.title, form.description, form.art, imageBlob, emitted.data.toNumber())
                    console.log("NFT.storage response:", metadata)

                    if (metadata) {
                        try {
                            await handleMint.mutateAsync({ args: [metadata] })
                            handleMintSuccess()
                        } catch (error) {
                            console.log("Following error occurred:", error)
                            handleMintError(cid)
                        } finally {
                            setIsMinting(false)
                        }
                    } else {
                        console.log("No metadata available")
                    }
                } else {
                    console.log("Fill all the fields")
                    handleGenerateError("Fill all the fields")
                    setIsMinting(false)
                }
            } else {
                handleGenerateError("Fill all the fields")
                setIsMinting(false)
            }
        } else {
            handleGenerateError("Wallet Not Connected")
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
                    container.style.boxShadow = "0px 0px 25px 15px rgba(3, 3, 3, 1)"

                    canvas.toBlob((blob) => {
                        if (blob && emitted.data) {
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

    async function handleGenerateError(error: string) {
        dispatch({
            type: "error",
            message: error,
            title: "NFT Creation Error",
            position: "bottomR",
            icon: "exclamation",
        })
    }

    return (
        <div ref={ref}>
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
                            onChange={() => hashCreator((hash) => setForm({ ...form, art: hash }))}
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
                {!form.art && (
                    <div className="lg:flex hidden text-center justify-end pl-[10rem] pr-[10rem] mt-[4.5rem]">
                        <p className="h-[10rem] bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-4xl font-bold self-center drop-shadow-shady">
                            Magic Will Be Happening Here...
                        </p>
                    </div>
                )}
                {form.art && (
                    <div className="lg:flex hidden flex-col text-center justify-end xl:pl-[15rem] pl:[2rem] pr-[14rem] mt-[2rem]">
                        <div
                            ref={containerRef}
                            id="certificate-container"
                            style={{
                                position: "relative",
                                width: "25.4rem",
                                height: "35.9rem",
                                background: `url('/certificate.png')`,
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                boxShadow: "0px 0px 25px 15px rgba(3, 3, 3, 1)",
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
                                <p className=" text-certH text-xl mt-3 font-bold" style={{ textShadow: "2px 2px #000" }}>
                                    Author
                                </p>
                                <p className="text-certL text-sm mt-1" style={{ textShadow: "2px 2px #000" }}>
                                    <span>{form.author}</span>
                                </p>
                                {form.co_author && (
                                    <div className="text-certH text-xl font-bold" style={{ textShadow: "2px 2px #000" }}>
                                        Co-Author
                                        <p className="text-certL text-sm mt-1 font-normal">
                                            <span>{form.co_author}</span>
                                        </p>
                                    </div>
                                )}
                                <div className="text-certH text-xl font-bold" style={{ textShadow: "2px 2px #000" }}>
                                    Title
                                    <p className="text-certL text-sm mt-1 font-normal">
                                        <span>{form.title}</span>
                                    </p>
                                </div>
                                <div className="text-certH text-xl font-bold" style={{ textShadow: "2px 2px #000" }}>
                                    Creator Address
                                    <p className="text-certL text-sm mt-1">
                                        <span className="text-certL text-sm mt-1 font-normal">{account}</span>
                                    </p>
                                </div>
                                <div className="text-certH text-xl font-bold" style={{ textShadow: "2px 2px #000" }}>
                                    Art Hash
                                    <p className="text-certL text-sm mt-1">
                                        <span className="text-certL text-[0.72rem] mt-1 font-normal">{form.art}</span>
                                    </p>
                                </div>
                                <p className="text-certH text-xl font-bold" style={{ textShadow: "2px 2px #000" }}>
                                    Certificate_Id_{emitted.data.toNumber()}
                                </p>
                                <div className="text-certH text-xl font-bold" style={{ textShadow: "2px 2px #000" }}>
                                    Description{" "}
                                    <p className="text-certL text-sm mt-1">
                                        <span className="text-certL text-sm mt-1 font-normal">{form.description}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button name="Download" onClick={handleDownloadCertificate} />
                    </div>
                )}
            </div>
        </div>
    )
}
