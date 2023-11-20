import React, { useState, useRef } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import { Button } from "@/components/button"
import contract from "@/contracts/DigitalRightsMaykr.json"
import clsx from "clsx"

export default function Clause() {
    const { isWeb3Enabled, account } = useMoralis()
    /* @ts-ignore */
    const { runContractFunction } = useWeb3Contract()
    const [isLoading, setIsLoading] = useState(false)
    const [clause, setClause] = useState("")
    const dispatch = useNotification()

    const tokenRef = useRef<HTMLInputElement | null>(null)

    const contractAddress = contract.address
    const abi = contract.abi

    const handleGetClause = async () => {
        setIsLoading(true)
        try {
            var tokenId = tokenRef.current?.value

            const getClause = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "getClause",
                params: {
                    tokenId: tokenId,
                    borrower: account,
                },
            }

            const clauseOutput = await runContractFunction({
                params: getClause,
            })

            if (clauseOutput) {
                setClause(clauseOutput as string)
            } else if (tokenRef.current?.value === "") {
                setClause("")
                await handleClauseError()
            } else if (tokenRef.current?.value !== "") {
                const wrongClause = "Clause Not Detected"
                setClause(wrongClause)
                await handleClauseError()
            }
        } catch (error) {
            console.error(`Getting Clause Failed With Error: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleClauseError() {
        dispatch({
            type: "error",
            message: "Incorrect TokenId Provided",
            title: "Clause Reading Error!",
            position: "bottomR",
            icon: "exclamation",
        })
    }

    return (
        <div>
            {!isWeb3Enabled ? (
                <div className="flex flex-col text-center items-center justify-center mt-[20rem] mb-[18rem]">
                    <p className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-6xl font-bold h-[10rem]">
                        Connect Your Wallet To Read Clause
                    </p>
                </div>
            ) : (
                <div
                    className={clsx("text-center flex-wrap justify-center items-center mb-[23rem]", {
                        "!mb-[1rem]": clause.includes("The Artist") || clause === "Clause Not Detected",
                    })}
                >
                    <div className="flex mt-[12rem] justify-center px-4">
                        <h4 className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[5rem] text-transparent bg-clip-text text-4xl font-bold">
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
                        {clause.includes("The Artist") && (
                            <div className="flex flex-col justify-center items-center ">
                                <div className="mt-[2rem] mb-[1rem] lg:mb-0 bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[5rem] text-transparent bg-clip-text text-4xl font-bold">
                                    Delivered Directly From Blockchain
                                </div>
                                <div className="border-0 shadow-dark w-[30rem] h-[15rem] text-white bg-dev rounded-lg bg-opacity-80">
                                    <div className="py-[0.5rem] px-[2rem] text-center leading-8">{clause}</div>
                                </div>
                            </div>
                        )}
                        {clause === "Clause Not Detected" ? (
                            <div className="mt-[10rem] mb-[7rem] bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[5rem] text-transparent bg-clip-text text-4xl font-bold">
                                {clause}
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
