import { useRouter } from "next/router"
import Button from "@/components/button"

export default function Index() {
    const router = useRouter()

    const handleClick = () => {
        router.push("/maykr")
    }

    return (
        <section className="w-full mt-[6rem] text-center text-purple-200">
            <div className="text-center">
                <h1 className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[10rem] text-transparent bg-clip-text text-5xl sm:text-6xl font-bold">
                    Welcome To Digital Rights Maykr!
                </h1>
            </div>

            <div className="flex justify-center mx-8">
                <iframe width="640" height="360" src="https://www.youtube.com/embed/LLAGgFATvGY" allowFullScreen></iframe>
            </div>

            <Button name="Enter Maykr!" onClick={handleClick} />
        </section>
    )
}
