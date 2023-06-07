import { useWeb3Contract, useMoralis } from "react-moralis"
import React, { useState } from "react"
import { useNotification } from "web3uikit"
import Welcome from "../styles/Welcome.module.css"
import Creation from "../styles/Creation.module.css"
import contract from "../contracts/DigitalRightsMaykr.json"

export default function Home() {
    const { account } = useMoralis()
    const { runContractFunction } = useWeb3Contract()
    const [isLoading, setIsLoading] = useState(false)
    const [clause, setClause] = useState("")
    const dispatch = useNotification()

    const combinedClasses = `${Creation.inputBox} ${Welcome.inputBox}`
    const contractAddress = contract.address
    const abi = contract.abi

    const handleGetClause = async () => {
        setIsLoading(true)
        try {
            var tokenId = document.getElementById("tokenId").value

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
                setClause(clauseOutput)
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
                <p className={Welcome.clause}>Read Active Clause</p>
                <input type="text" className={combinedClasses} id="tokenId" name="tokenId" placeholder="TokenId" />
                <button className={Welcome.button} onClick={handleGetClause} disabled={isLoading}>
                    {isLoading ? <div className={Creation.waitSpinner}></div> : "Read"}
                </button>

                {clause.includes("The Artist") && <div className={Welcome.chainInfo}>Delivered Directly From Blockchain:</div>}
                <div className={Welcome.clauseContainer}>
                    {clause.includes("The Artist") && <img className={Welcome.clauseImage} src="/clause.png" alt="clause" />}
                    <div className={Welcome.clauseText}>{clause}</div>
                </div>

                <p className={Welcome.nft}>
                    {" "}
                    DRM Contract Address: <span className={Welcome.address}>{contractAddress}</span>
                </p>
            </div>
        </div>
    )
}
