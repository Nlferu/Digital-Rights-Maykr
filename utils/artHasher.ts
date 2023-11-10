import CryptoJS from "crypto-js"

async function getHASH(blob: Blob, cbProgress?: (progress: number) => void): Promise<string> {
    return new Promise((resolve, reject) => {
        const the_hash = CryptoJS.algo.SHA256.create()

        readChunked(
            blob,
            (chunk, offs, total) => {
                the_hash.update(CryptoJS.enc.Latin1.parse(chunk))
                if (cbProgress) {
                    cbProgress(offs / total)
                }
            },
            (err) => {
                if (err) {
                    reject(err)
                } else {
                    const hash = the_hash.finalize()
                    const hashHex = hash.toString(CryptoJS.enc.Hex)
                    resolve(hashHex)
                }
            }
        )
    })
}

async function process(setArtHash: (hash: string) => void): Promise<void> {
    const art = document.getElementById("art") as HTMLInputElement

    if (art && art.files && art.files.length > 0) {
        getHASH(art.files[0]).then(
            (res) => {
                setArtHash(res)
            },
            (err) => console.log(err)
        )
    }
}

async function readChunked(
    file: Blob,
    chunkCallback: (chunk: string, offs: number, total: number) => void,
    endCallback: (err: Error | null) => void
): Promise<void> {
    const fileSize = file.size
    const chunkSize = 4 * 1024 * 1024 // 4MB
    let offset = 0

    const reader = new FileReader()

    reader.onload = function () {
        if (typeof reader.result === "string") {
            if (reader.error) {
                endCallback(reader.error || new Error("File reader error"))
                return
            }
            offset += reader.result.length
            chunkCallback(reader.result, offset, fileSize)
            if (offset >= fileSize) {
                endCallback(null)
                return
            }
            readNext()
        }
    }

    reader.onerror = function (err) {
        endCallback(err instanceof Error ? err : new Error("File reader error"))
    }

    function readNext() {
        const fileSlice = file.slice(offset, offset + chunkSize)
        reader.readAsBinaryString(fileSlice)
    }
    readNext()
}

async function hashCreator(setArtHash: (hash: string) => void): Promise<void> {
    const art = document.getElementById("art") as HTMLInputElement

    if (!art.files?.length) {
        console.log("You must select a file to certify first!")
    } else {
        await process(setArtHash)
    }
}

export default hashCreator
