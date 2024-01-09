import React, { useState, useRef } from "react"
import { Button } from "@/components/button"
import { useSectionInView } from "@/lib/hooks"
import { useAddress, useContract, useConnectionStatus } from "@thirdweb-dev/react"
import { handleError } from "@/lib/error-handlers"
import { getErrorMessage } from "@/lib/utils"
import maykr from "@/contracts/DigitalRightsMaykr.json"
import clsx from "clsx"

export default function Clause() {
    const { ref } = useSectionInView("Clause", 0.5)
    const [isLoading, setIsLoading] = useState(false)
    const [clause, setClause] = useState("")

    const tokenRef = useRef<HTMLInputElement | null>(null)

    const contractAddress = maykr.address
    const abi = maykr.abi

    const { contract } = useContract(contractAddress, abi)
    const account = useAddress()
    const connectionStatus = useConnectionStatus()

    const handleGetClause = async () => {
        if (contract) {
            if (connectionStatus === "connected") {
                setIsLoading(true)
                try {
                    var tokenId = tokenRef.current?.value

                    const clause = await contract.call("getClause", [tokenId, account])
                    console.log(`Clause from tokenId: ${tokenId} is: ${clause}`)

                    if (clause !== "") {
                        setClause(clause)
                    } else if (clause === "") {
                        const wrongClause = "Clause Not Detected"
                        setClause(wrongClause)
                    }
                } catch (error) {
                    setClause("")
                    handleError(getErrorMessage(error))
                } finally {
                    setIsLoading(false)
                }
            } else {
                handleError("Wallet Not Connected")
            }
        } else {
            handleError("Contract does not exists")
        }
    }

    return (
        <div ref={ref}>
            <div
                className={clsx("text-center flex-wrap justify-center items-center mb-[23rem]", {
                    "!mb-[1rem]": clause.includes("The Artist") || clause === "Clause Not Detected",
                })}
            >
                <div className="flex mt-[12rem] justify-center px-4">
                    <h4 className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[5rem] text-transparent bg-clip-text text-2xl sm:text-4xl font-bold drop-shadow-shady">
                        Read Active Clause
                    </h4>
                </div>
                <input
                    type="text"
                    className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center text-gray-300 focus:text-gray-300 placeholder:text-gray-100"
                    ref={tokenRef}
                    id="tokenId"
                    name="tokenId"
                    placeholder="TokenId"
                />

                <Button name={"Read"} onClick={handleGetClause} disabled={isLoading} />

                <div>
                    {clause.includes("The Artist") ? (
                        <div className="flex flex-col justify-center items-center ">
                            <div className="mt-[2rem] mb-[1rem] lg:mb-0 bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[5rem] text-transparent bg-clip-text text-4xl font-bold drop-shadow-shady">
                                Delivered Directly From Blockchain
                            </div>
                            <div className="border-0 shadow-dark w-[30rem] h-[15rem] text-white bg-dev rounded-lg bg-opacity-80">
                                <div className="py-[0.5rem] px-[2rem] text-center leading-8">{clause}</div>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                    {clause === "Clause Not Detected" ? (
                        <div className="mt-[10rem] mb-[7rem] bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[5rem] text-transparent bg-clip-text text-4xl font-bold drop-shadow-shady">
                            {clause}
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
        </div>
    )
}
