import { useRouter } from "next/router"
import Info from "@/styles/Info.module.css"

export default function Home() {
    const router = useRouter()

    const handleClick = () => {
        router.push("/maykr")
    }

    return (
        <section className="w-full py-[6rem] text-center text-white">
            <h1>Welcome To Digital Rights Maykr!</h1>
            <div className="pt-[2rem] flex justify-center">
                <iframe width="640" height="360" src="https://www.youtube.com/embed/LLAGgFATvGY" allowFullScreen></iframe>
            </div>

            <p className="text-purple-200 font-extrabold mt-[2rem]">We are currently working on renovation of this page.</p>
            <p className="text-purple-200 font-extrabold mt-[1rem]">Updated version coming soon...</p>
            <button className={Info.button} onClick={handleClick}>
                Enter Maykr!
            </button>
        </section>
    )
}
