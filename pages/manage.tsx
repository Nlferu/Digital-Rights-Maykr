import React, { useState, useRef } from "react"
import { ethers } from "ethers"
import { manageInputs } from "@/lib/data"
import { Button } from "@/components/button"
import { useSectionInView } from "@/lib/hooks"
import { useContract, useConnectionStatus, useContractWrite } from "@thirdweb-dev/react"
import { handleError, handleSuccess } from "@/lib/error-handlers"
import { getErrorMessage } from "@/lib/utils"
import maykr from "@/contracts/DigitalRightsMaykr.json"

export default function Manage() {
    const { ref } = useSectionInView("Manage", 0.5)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingB, setIsLoadingB] = useState<boolean>(false)

    const refs = {
        tokenIdRef: useRef<HTMLInputElement | null>(null),
        lendingTimeRef: useRef<HTMLInputElement | null>(null),
        priceRef: useRef<HTMLInputElement | null>(null),
        blockTokenIdRef: useRef<HTMLInputElement | null>(null),
    }

    const contractAddress = maykr.address
    const abi = maykr.abi

    const { contract } = useContract(contractAddress, abi)
    const connectionStatus = useConnectionStatus()
    const handleLend = useContractWrite(contract, "allowLending")
    const handleBlock = useContractWrite(contract, "blockLending")

    const handleLendCertificate = async () => {
        if (connectionStatus === "connected") {
            setIsLoading(true)

            try {
                var tokenId = refs.tokenIdRef.current?.value
                var lendingTime = refs.lendingTimeRef.current?.value
                var price = refs.priceRef.current?.value
                console.log(`TokenId: ${tokenId} LendingTime: ${lendingTime} Price: ${price}`)

                // ETH Conversion To Wei
                let convPrice = ethers.utils.parseEther(price as string)

                await handleLend.mutateAsync({ args: [tokenId, lendingTime, convPrice] })
                handleSuccess("Lend Certificate: Certificate Lending Allowed")
            } catch (error) {
                handleError(getErrorMessage(error))
            } finally {
                setIsLoading(false)
            }
        } else {
            handleError("Wallet Not Connected")
        }
    }

    const handleBlockCertificate = async () => {
        if (connectionStatus === "connected") {
            setIsLoadingB(true)

            try {
                var blockTokenId = refs.blockTokenIdRef.current?.value

                await handleBlock.mutateAsync({ args: [blockTokenId] })
                handleSuccess("Lend Certificate: Certificate Lending Blocked")
            } catch (error) {
                handleError(getErrorMessage(error))
            } finally {
                setIsLoadingB(false)
            }
        } else {
            handleError("Wallet Not Connected")
        }
    }

    return (
        <div ref={ref}>
            <div>
                <div className="flex mt-[7rem] justify-center mb-[1rem]">
                    <h4 className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[5rem] text-transparent bg-clip-text text-2xl sm:text-4xl font-bold drop-shadow-shady">
                        Lend Certificate
                    </h4>
                </div>
                <div className="flex flex-col text-center">
                    <div className="flex flex-col gap-3 w-[16rem] self-center">
                        {manageInputs.map((input) => (
                            <input
                                className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center text-gray-300 focus:text-gray-300 placeholder:text-gray-100"
                                key={input.name}
                                type={input.type}
                                name={input.name}
                                id={input.name}
                                ref={refs[input.ref]}
                                placeholder={input.placeholder}
                            ></input>
                        ))}

                        <Button name="Allow Lending" onClick={handleLendCertificate} disabled={isLoading} />
                    </div>
                    <div className="flex mt-[5rem] justify-center">
                        <h4 className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[5rem] text-transparent bg-clip-text text-2xl sm:text-4xl font-bold drop-shadow-shady">
                            Block Certificate
                        </h4>
                    </div>
                    <div className="flex flex-col gap-3 w-[16rem] self-center">
                        <input
                            type="text"
                            className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center text-gray-300 focus:text-gray-300 placeholder:text-gray-100"
                            ref={refs.blockTokenIdRef}
                            id="blockTokenId"
                            name="tokenId"
                            placeholder="TokenId"
                        />

                        <Button name="Block Lending" onClick={handleBlockCertificate} disabled={isLoadingB} />
                    </div>
                </div>
            </div>
        </div>
    )
}
