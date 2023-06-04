import Welcome from "../styles/Welcome.module.css"
import Creation from "../styles/Creation.module.css"
import contract from "../contracts/DigitalRightsMaykr.json"

export default function Home() {
    const contractAddress = contract.address
    const abi = contract.abi

    return (
        <div className={Welcome.container}>
            <p className={Welcome.clause}>Read Active Clause</p>
            <input type="text" className={Creation.inputBox} id="tokenId" name="tokenId" placeholder="TokenId" />
            <button className={Welcome.button}>Read</button>
            <p className={Welcome.nft}>
                {" "}
                NFT Contract Address: <span className={Welcome.address}>{contractAddress}</span>
            </p>
        </div>
    )
}
