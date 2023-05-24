import { useEffect, useState } from "react"
import contract from "../contracts/DigitalRightsMaykr.json"

const contractAddress = contract.address
const abi = contract.abi

export default function Home() {
    const mintNftHandler = async () => {
        try {
            const { ethereum } = window

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const nftContract = new ethers.Contract(contractAddress, abi, signer)

                console.log("Initialize payment")
                let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.01") })

                console.log("Mining... please wait")
                await nftTxn.wait()

                console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
            } else {
                console.log("Ethereum object does not exist")
            }
        } catch (err) {
            console.log(err)
        }
    }

    const mintNftButton = () => {
        return <button onClick={mintNftHandler}>Mint NFT</button>
    }

    return (
        <div>
            <h1>Page assigned for creating Cerificates</h1>
            <div>{mintNftButton()}</div>
        </div>
    )
}
