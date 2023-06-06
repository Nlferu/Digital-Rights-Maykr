import { useRouter } from "next/router"
import React from "react"
import Info from "../styles/Info.module.css"

export default function InformationPage({ onClick }) {
    const router = useRouter()

    const handleClick = () => {
        router.push("/create_certificate")
    }

    return (
        <div>
            <div className={Info.description}>
                <h1>Welcome To Digital Rights Maykr!</h1>
                <p>Where the power of blockchain revolutionizes the protection and authentication of your intellectual property.</p>
                <p>Unlock the extraordinary potential to safeguard your creations and establish undeniable proof of your authorship.</p>
                <br />
                <p>Imagine you've composed an incredible song, and now you desire irrefutable evidence of your role as its creator.</p>
                <p>
                    With our innovative <strong>Create Certificate</strong> feature, you can effortlessly upload your masterpiece.
                </p>
                <p>Watch as it is encrypted, transformed into a unique hash code, and paired with essential information about yourself and your work.</p>
                <p>The result? A downloadable image that encapsulates your artistic brilliance. But that's just the beginning.</p>
                <br />
                <p>
                    To truly solidify your rights on the blockchain, click the <strong>Mint NFT</strong> button.
                </p>
                <p>
                    This action triggers a sequence of remarkable events: your creation is securely stored on <em>nft.storage</em>, then swiftly posted on IPFS
                    with an exclusive token URI.
                </p>
                <p>These extraordinary steps pave the way for the minting of your non-fungible token, adhering to the groundbreaking ERC4671 protocol.</p>
                <p>Your personalized NFT becomes a tangible testament to your talent, one that can be proudly added to your digital wallet.</p>
                <br />
                <p>
                    Visit our <strong>Gallery</strong> page to immerse yourself in a captivating display of the artistic masterpieces our community has created.
                </p>
                <p>Explore the diverse collection of NFTs, each bearing the unique essence of their creators' vision and skill.</p>
                <br />
                <p>
                    In the <strong>Manage Certificate</strong> section, our visionary artists can bestow the rights to their NFTs, enabling others to
                    incorporate their work into commercial endeavors and more.
                </p>
                <p>These permissions are securely anchored by an immutable blockchain-based clause, certifying the authenticity of each agreement.</p>
                <p>
                    Feel free to click the enticing <strong>"Enter"</strong> button below to delve into the remarkable world of these digital contracts.
                </p>
                <br />
                <p>
                    And let's not forget our <strong>"Profits"</strong> page, an unparalleled platform that empowers creators who lend their art.
                </p>
                <p>
                    Here, you can effortlessly withdraw your earnings or choose to stake them with Verse, embarking on an exciting journey towards even greater
                    prosperity.
                </p>
                <p>The possibilities are boundless!</p>
                <br />
                <p>
                    <strong>Digital Rights Maykr</strong> is the ultimate tool for creators, an awe-inspiring sanctuary where your artistic genius flourishes.
                </p>
                <p>Join us on this extraordinary adventure, and embrace the boundless possibilities that await you.</p>
                <p>May your journey be filled with happiness and unparalleled success!</p>
                <button className={Info.button} onClick={handleClick}>
                    Enter Maykr!
                </button>
            </div>
        </div>
    )
}
