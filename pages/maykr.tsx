import React, { useState, useRef } from "react"
import { uploadToNftStorage } from "@/utils/uploadToNftStorage"
import { deleteFromNftStorage } from "@/utils/deleteFromNftStorage"
import { Button } from "@/components/button"
import { inputs } from "@/lib/data"
import { useSectionInView } from "@/lib/hooks"
import { useAddress, useContract, useContractRead, useContractWrite, useConnectionStatus } from "@thirdweb-dev/react"
import { handleError, handleSuccess } from "@/lib/error-handlers"
import { validateString, getErrorMessage } from "@/lib/utils"
import { motion } from "framer-motion"
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
                            handleError("Error: \nUnable to create Blob from canvas")
                        }
                    }, "image/png")
                })

                // Restore the box shadow after generating the image
                certificateContainer.style.boxShadow = "0px 0px 15px 5px #5acdf1"
                // Pass the image blob to the upload function
                if (form.author && form.title && form.description && form.art && imageBlob && emitted.data.toNumber() >= 0) {
                    if (!validateString(form.author, 30) || !validateString(form.co_author, 30) || !validateString(form.title, 30)) {
                        handleError("Error: \nMaximum characters amount is 30")
                        setIsMinting(false)
                    } else if (!validateString(form.description, 275)) {
                        handleError("Error: \nMaximum characters amount is 275")
                        setIsMinting(false)
                    } else {
                        const { metadata, cid } = await uploadToNftStorage(
                            form.author,
                            form.title,
                            form.description,
                            form.art,
                            imageBlob,
                            emitted.data.toNumber()
                        )

                        console.log("NFT.storage response:", metadata)

                        if (metadata) {
                            try {
                                await handleMint.mutateAsync({ args: [metadata] })
                                handleMintSuccess()
                            } catch (error) {
                                handleMintError(getErrorMessage(error), cid)
                            } finally {
                                setIsMinting(false)
                            }
                        } else {
                            handleError("Error: \nNo Metadata Available")
                            setIsMinting(false)
                        }
                    }
                } else {
                    handleError("Minting Error: \nPlease fill all the necessary fields")
                    setIsMinting(false)
                }
            } else {
                handleError("Minting Error: \nPlease fill all the necessary fields")
                setIsMinting(false)
            }
        } else {
            handleError("Error: \nWallet Not Connected")
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
                    container.style.boxShadow = "0px 0px 15px 5px #5acdf1"

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
        handleSuccess("Minting: \nNFT Created Successfully!")

        setTimeout(() => {
            location.reload()
        }, 2000)
    }

    async function handleMintError(error: string, cid: string) {
        handleError(error)

        deleteFromNftStorage(cid)
    }

    return (
        <section
            className="flex items-center lg:pl-[14rem] mr-0 sm:mr-[-1rem] lg:pr-[-10rem] h-[45rem] mt-0 sm:mt-[3.5rem] gap-20 px-[1rem] mb-[-4rem] lg:mb-0"
            ref={ref}
        >
            <motion.div
                className="flex flex-col gap-3 w-[16rem] self-center mt-0 sm:mt-[4.5rem] justify-center"
                initial={{ opacity: 0, x: `-100%` }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9 }}
            >
                <div
                    className="h-[2rem] bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text font-bold self-center
                                drop-shadow-shady text-lg"
                >
                    Choose File For Certification:
                </div>
                <input
                    type="file"
                    className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center cursor-pointer text-white"
                    id="art"
                    name="art"
                    placeholder="Art Hash"
                    onChange={() => hashCreator((hash) => setForm({ ...form, art: hash }))}
                />

                {inputs.map((input) => (
                    <div className="relative" key={input.name}>
                        <input
                            className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center text-gray-300 focus:text-gray-300
                                     placeholder:text-gray-100 w-full"
                            type={input.type}
                            name={input.name}
                            id={input.name}
                            placeholder={input.placeholder}
                            onChange={handleInputChange}
                        />
                        {input.placeholder !== "Co-Author" && !form[input.name] && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    left: `calc(50% + ${input.placeholder.length * 0.5}ch)`,
                                    color: "#f06543",
                                }}
                            >
                                *
                            </span>
                        )}
                    </div>
                ))}
                <Button name="Mint NFT" onClick={handleGenerateCertificate} disabled={isMinting} />
            </motion.div>

            {/* Certificate will show only if we have "art" field filled */}
            {!form.art && (
                <motion.div
                    className="lg:flex hidden text-center justify-end pl-[10rem] pr-[10rem] mt-[4.5rem]"
                    initial={{ opacity: 0, x: `100%` }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                >
                    <p
                        className="h-[10rem] bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-4xl font-bold
                                  self-center drop-shadow-shady"
                    >
                        Magic Will Be Happening Here...
                    </p>
                </motion.div>
            )}
            {form.art && (
                <motion.div
                    className="lg:flex hidden flex-col text-center justify-end xl:pl-[15rem] pl:[2rem] pr-[14rem] mt-[2rem]"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div
                        ref={containerRef}
                        id="certificate-container"
                        className="relative w-[25.4rem] h-[35.9rem] bg-contain bg-center bg-no-repeat bg-[url('/certificate.png')] shadow-cert"
                    >
                        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-white text-center mt-[3rem]">
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
                </motion.div>
            )}
        </section>
    )
}
