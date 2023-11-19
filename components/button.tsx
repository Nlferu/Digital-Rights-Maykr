interface ButtonProps {
    name: string
    onClick: () => void
    disabled?: boolean
}

export default function Button({ name, onClick, disabled }: ButtonProps) {
    return (
        <button
            className="group relative text-purple-200 flex m-auto mt-[1.5rem] justify-center items-center overflow-hidden w-[8.4rem] h-[3.9rem] bg-tblack rounded-full
                after:content-[''] after:absolute after:w-[12rem] after:h-[10rem] after:bg-linear-gradient after:animate-fullSpin
                hover:scale-[1.03] active:scale-[1.01]"
            onClick={onClick}
            disabled={disabled}
        >
            <span
                className="absolute flex font-bold justify-center items-center inset-[0.2rem] bg-devil rounded-full z-[1]
                group-hover:bg-black group-hover:scale-[1.03] duration-custom ease-customBezier
                group-active-scale[1.01] group-hover:text-white"
            >
                {disabled ? <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-lightB"></div> : <>{name}</>}
            </span>
        </button>
    )
}
