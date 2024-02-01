import { useSectionInView } from "@/lib/hooks"
import { motion } from "framer-motion"
import contract from "@/contracts/DigitalRightsMaykr.json"

export default function About() {
    const { ref } = useSectionInView("About", 0.5)
    const contractAddress = contract.address

    return (
        <section className="block mt-[6rem] text-center text-white drop-shadow-shady mb-10" ref={ref}>
            <motion.div className="text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
                <h1 className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 h-[6rem] sm:h-[5rem] text-transparent bg-clip-text text-4xl sm:text-6xl font-bold">
                    Digital Rights Maykr
                </h1>
            </motion.div>

            <motion.div
                className="flex flex-col text-center items-center text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 1 }}
            >
                <div className="mt-10 mb-4 max-w-[60rem]">
                    Welcome to our revolutionary project, the Creator and Artists Tool a haven for unleashing your artistic brilliance and garnering
                    well-deserved recognition.
                </div>
                <div className="mb-4 max-w-[58rem] leading-[2rem]">
                    Immerse yourself in the transformative power of blockchain technology, redefining the protection and authentication of your intellectual
                    property. Safeguard your creations with unprecedented security, establishing irrefutable proof of your authorship. Unlock the extraordinary
                    potential to earn proceeds from your work. With Verse, you gain the flexibility to withdraw or multiply your earnings, putting the control
                    firmly in your hands. Offer others the opportunity to purchase rights for their projects, respecting your terms and timeline. Embrace the
                    concept of shared creativity while maintaining ownership. Navigate our gallery to ensure the uniqueness of your creations. Avoid duplication
                    and find inspiration by exploring similar works, fostering a community of originality.
                </div>
                <div className="max-w-[50rem]">
                    Our protocol boasts cutting-edge features designed to empower you in creating and lending rights to your masterpiece. Join us in shaping the
                    future of artistic collaboration and protection!
                </div>
            </motion.div>

            <motion.div
                className="flex flex-col font-bold mt-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                <p className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 h-[4rem] sm:h-[3rem] text-transparent bg-clip-text text-2xl sm:text-3xl font-bold">
                    DRM Contract Address:{" "}
                </p>
                <span className="text-xs sm:text-xl text-pink-200">{contractAddress}</span>
            </motion.div>
        </section>
    )
}
