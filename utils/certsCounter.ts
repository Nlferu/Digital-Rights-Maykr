/** @DEV not working currently -> try to make use of it */

import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import contract from "@/contracts/DigitalRightsMaykr.json"

export const certsCounter = async () => {
    const { isWeb3Enabled } = useMoralis()
    const [amount, setAmount] = useState<string>("")

    const contractAddress = contract.address
    const abi = contract.abi

    const { runContractFunction: emittedCount } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "emittedCount",
        params: {},
    })

    const handleEmittedCertsCounter = async () => {
        /** @dev Wallet has to be connected to get below associated with -> isWeb3Enabled check */
        const getAmount = ((await emittedCount()) as string).toString()
        console.log(`Emitted Certs Count is: ${getAmount}`)
        setAmount(getAmount)
    }

    useEffect(() => {
        const fetchData = async () => {
            if (isWeb3Enabled) {
                await handleEmittedCertsCounter()
            }
        }

        fetchData()
    }, [isWeb3Enabled, amount])

    return amount
}
