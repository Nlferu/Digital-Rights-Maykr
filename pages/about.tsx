import { useSectionInView } from "@/lib/hooks"
import contract from "@/contracts/DigitalRightsMaykr.json"

export default function About() {
    const { ref } = useSectionInView("About", 0.5)
    const contractAddress = contract.address

    return (
        <section className="flex flex-col mt-[6rem] text-center text-white" ref={ref}>
            <div className="text-center">
                <h1 className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[5rem] text-transparent bg-clip-text text-5xl sm:text-6xl font-bold">
                    Digital Rights Maykr
                </h1>
            </div>

            <div className="inline-block w-[45rem] mt-[1rem]">
                <div>
                    <strong className="list-inside mt-[1rem] text-blue-400 text-xl underline">Creator And Artists Tool </strong>
                    <p className="text-sm text-white font-bold py-[0.5rem] leading-6 flex flex-wrap px-[10rem]">
                        This project is the ultimate tool for creators, providing an awe-inspiring sanctuary for your artistic genius to flourish and gain
                        recognition.
                    </p>
                </div>
                <div className="mt-[1.5rem]">
                    <strong className="list-inside mt-[1rem] text-blue-400 text-xl underline">Power Of Blockchain </strong>
                    <p className="text-sm text-white font-bold py-[0.5rem] leading-6 flex flex-wrap px-[10rem]">
                        Experience the true power of blockchain, revolutionizing the protection and authentication of your intellectual property.
                    </p>
                </div>
                <div className="mt-[1.5rem]">
                    <strong className="list-inside mt-[1rem] text-blue-400 text-xl underline">Safetiness </strong>
                    <p className="text-sm text-white font-bold py-[0.5rem] leading-6 flex flex-wrap px-[10rem]">
                        Unlock the extraordinary potential to safeguard your creations and establish undeniable proof of your authorship.
                    </p>
                </div>
                <div className="mt-[1.5rem]">
                    <strong className="list-inside mt-[1rem] text-blue-400 text-xl underline">Cutting Edge Features </strong>
                    <p className="text-sm text-white font-bold py-[0.5rem] leading-6 flex flex-wrap px-[10rem]">
                        Our protocol offers cutting-edge features enabling you to create and lend rights to your masterpiece.
                    </p>
                </div>
                <div className="mt-[1.5rem]">
                    <strong className="list-inside mt-[1rem] text-blue-400 text-xl underline">Proceeds </strong>
                    <p className="text-sm text-white font-bold py-[0.5rem] leading-6 flex flex-wrap px-[10rem]">
                        Earn proceeds from your work and gain the possibility to withdraw or multiply those earnings with Verse!
                    </p>
                </div>
                <div className="mt-[1.5rem]">
                    <strong className="list-inside mt-[1rem] text-blue-400 text-xl underline">Rights Purchase </strong>
                    <p className="text-sm text-white font-bold py-[0.5rem] leading-6 flex flex-wrap px-[10rem]">
                        Others can purchase rights for their usage in their projects, but only for the time specified by you.
                    </p>
                </div>
                <div className="mt-[1.5rem]">
                    <strong className="list-inside mt-[1rem] text-blue-400 text-xl underline">Gallery </strong>

                    <p className="text-sm text-white font-bold py-[0.5rem] leading-6 flex flex-wrap px-[10rem]">
                        If you&apos;re unsure whether someone has already created artistry similar to what you&apos;re working on to ensure your idea is unique!
                    </p>
                </div>
            </div>

            <div className="mt-[3rem] text-3xl lg:text-4xl text-red-400">
                <p>The possibilities are boundless!</p>
            </div>
            <div className="flex flex-col pt-[3rem] font-bold">
                <p className="text-2xl text-[#6d075b] underline">DRM Contract Address: </p>
                <span className="text-xl pt-[1rem] text-pink-200">{contractAddress}</span>
            </div>
        </section>
    )
}
