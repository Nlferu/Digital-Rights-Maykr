import { useRouter } from "next/router"

export default function Home() {
    const router = useRouter()

    const handleClick = () => {
        router.push("/maykr")
    }

    return (
        <section className="w-full py-[6rem] text-center text-white">
            <h1 className="font-bold text-4xl text-purple-200">Welcome To Digital Rights Maykr!</h1>
            <div className="pt-[2rem] flex justify-center mb-[2rem]">
                <iframe width="640" height="360" src="https://www.youtube.com/embed/LLAGgFATvGY" allowFullScreen></iframe>
            </div>

            <button className="btn-hover-effect h-[3.5rem] w-[8rem] bg-black rounded-full" onClick={handleClick}>
                Enter Maykr!
            </button>
        </section>
    )
}
