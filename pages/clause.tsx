import React, { useState, useRef } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import Image from "next/image"
import Welcome from "@/styles/Welcome.module.css"
import Creation from "@/styles/Creation.module.css"
import contract from "@/contracts/DigitalRightsMaykr.json"
import Gallery from "@/styles/Gallery.module.css"

export default function Clause() {
    const { isWeb3Enabled, account } = useMoralis()
    /* @ts-ignore */
    const { runContractFunction } = useWeb3Contract()
    const [isLoading, setIsLoading] = useState(false)
    const [clause, setClause] = useState("")
    const dispatch = useNotification()

    const tokenRef = useRef<HTMLInputElement | null>(null)

    const combinedClasses = `${Creation.inputBox} ${Welcome.inputBox}`
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
                onError: () => handleClauseError(),
            })

            if (clauseOutput) {
                setClause(clauseOutput as string)
            } else {
                const wrongClause = "Clause Not Detected"
                setClause(wrongClause)
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
            <div className={Welcome.container}>
                {!isWeb3Enabled ? (
                    <p className={Gallery.info}>Connect Your Wallet To See Certificates</p>
                ) : (
                    <div>
                        <p className={Welcome.clause}>Read Active Clause</p>
                        <input type="text" className={combinedClasses} ref={tokenRef} id="tokenId" name="tokenId" placeholder="TokenId" />
                        <button className={Welcome.button} onClick={handleGetClause} disabled={isLoading}>
                            {isLoading ? <div className={Creation.waitSpinner}></div> : "Read"}
                        </button>

                        {clause.includes("The Artist") && <div className={Welcome.chainInfo}>Delivered Directly From Blockchain:</div>}
                        <div className={Welcome.clauseContainer}>
                            {clause.includes("The Artist") && <Image className={Welcome.clauseImage} height="200" width="200" src="/clause.png" alt="clause" />}
                            <div className={Welcome.clauseText}>{clause}</div>
                        </div>
                    </div>
                )}

                <p className={Welcome.nft}>
                    {" "}
                    DRM Contract Address: <span className={Welcome.address}>{contractAddress}</span>
                </p>
            </div>
        </div>
    )
}
