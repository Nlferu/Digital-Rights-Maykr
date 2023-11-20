import { useRouter } from "next/router"
import { Button } from "@/components/button"
import { useSectionInView } from "@/lib/hooks"

export default function Index() {
    const { ref } = useSectionInView("Home", 0.5)
    const router = useRouter()

    const handleClick = () => {
        router.push("/maykr")
    }

    return (
        <section className="w-full mt-[6rem] mb-[2rem] lg:mb-[5rem] text-center text-purple-200" ref={ref}>
            <div className="text-center">
                <h1 className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[10rem] text-transparent bg-clip-text text-5xl sm:text-6xl font-bold">
                    Welcome To Digital Rights Maykr!
                </h1>
            </div>

            <div className="flex justify-center px-8">
                <iframe width="640" height="360" src="https://www.youtube.com/embed/LLAGgFATvGY" allowFullScreen></iframe>
            </div>

            <Button name="Enter Maykr!" onClick={handleClick} />
        </section>
    )
}
