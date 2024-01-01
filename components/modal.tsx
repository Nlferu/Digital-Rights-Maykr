import React, { useState, useRef, MouseEvent } from "react"
import Tilt from "react-parallax-tilt"
import Image from "next/image"

type ModalProps = {
    children?: React.ReactNode
    closeModal: () => void
    selectedCertificateImage: string
}

export default function Modal({ children, closeModal, selectedCertificateImage }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const flipRef = useRef<HTMLDivElement>(null)
    const [flipHorizontally, setFlipHorizontally] = useState<boolean>(false)

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && e.target === modalRef.current) {
            closeModal()
            setFlipHorizontally(false)
        } else if (flipRef.current && e.target === flipRef.current) {
            setFlipHorizontally(false)
        }
    }

    const handleModalImageClick = () => {
        setFlipHorizontally(!flipHorizontally)
    }

    return (
        <div>
            <div ref={modalRef} className="flex fixed items-center justify-center left-0 top-0 w-full h-full bg-black/60 z-10 px-2" onClick={handleClick}>
                <Tilt tiltReverse={true} glareEnable={true} glareColor="#a4a4a4" glareMaxOpacity={0.35} flipHorizontally={flipHorizontally}>
                    {flipHorizontally ? (
                        <div
                            ref={flipRef}
                            className="w-[25rem] h-[35.32rem] bg-[#26133b] border border-black flex items-center justify-center text-white my-rotate-y-180"
                            onClick={handleClick}
                        >
                            FlippedCert
                        </div>
                    ) : (
                        <Image
                            src={selectedCertificateImage}
                            height={400}
                            width={400}
                            quality="95"
                            priority={true}
                            alt="NFT Image"
                            onClick={handleModalImageClick}
                        />
                    )}
                </Tilt>

                <div>{children}</div>
            </div>
        </div>
    )
}
