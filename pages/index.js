import { useRouter } from "next/router"
import React from "react"
import Info from "../styles/Info.module.css"

export default function InformationPage() {
    const router = useRouter()

    const handleClick = () => {
        router.push("/create_certificate")
    }

    return (
        <div>
            <div className={Info.description}>
                <h1>Welcome To Digital Rights Maykr!</h1>

                <p>
                    This project is the ultimate tool for creators, an awe-inspiring sanctuary where your artistic genius flourishes and can be noticed by
                    others!
                </p>
                <p>Experience the true power of blockchain that revolutionizes the protection and authentication of your intellectual property</p>
                <p>and unlock the extraordinary potential to safeguard your creations and establish undeniable proof of your authorship.</p>
                <br />

                <p> Our protocol offers a cutting-edge feature that enables you to create and lend rights to your masterpiece</p>
                <p>
                    which also allows you to get proceeds from your work and grants you possibility
                    <p>to withdraw or multiply those with our partner</p>
                    <p>
                        <strong>Verse</strong>!
                    </p>
                </p>
                <p> Of course others will be able to purchase rights for their own usage in their projects, but only for time specified by you.</p>
                <p> In case you are not sure if someone have invented already artistry you are thinking or working on already</p>
                <p>
                    {" "}
                    you can check our <strong>Gallery</strong> tab and see if your idea is totally unique!
                </p>
                <br />
                <p>Join us on this extraordinary adventure, and embrace the boundless possibilities that await you.</p>
                <p>May your journey be filled with happiness and unparalleled success!</p>

                <p>The possibilities are boundless!</p>
                <br />

                <button className={Info.button} onClick={handleClick}>
                    Enter Maykr!
                </button>
            </div>
        </div>
    )
}
