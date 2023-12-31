import React, { useRef, MouseEvent } from "react"

type ModalProps = {
    children: React.ReactNode
    closeModal: () => void
}

export default function Modal({ children, closeModal }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && e.target === modalRef.current) {
            closeModal()
        }
    }

    return (
        <div>
            <div ref={modalRef} className="flex fixed items-center justify-center left-0 top-0 w-full h-full bg-black/60 z-10" onClick={handleClick}>
                <div>{children}</div>
            </div>
        </div>
    )
}
