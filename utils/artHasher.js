import CryptoJS from "crypto-js"

async function getHASH(blob, cbProgress) {
    return new Promise((resolve, reject) => {
        var the_hash = CryptoJS.algo.SHA256.create()

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
                    var hash = the_hash.finalize()
                    var hashHex = hash.toString(CryptoJS.enc.Hex)
                    resolve(hashHex)
                }
            }
        )
    })
}

async function process(setArtHash) {
    var art = document.getElementById("art")
    getHASH(art.files[0]).then(
        (res) => {
            setArtHash(res)
        },
        (err) => console.log(err)
    )
}

async function readChunked(file, chunkCallback, endCallback) {
    var fileSize = file.size
    var chunkSize = 4 * 1024 * 1024 // 4MB
    var offset = 0

    var reader = new FileReader()

    reader.onload = function () {
        if (reader.error) {
            endCallback(reader.error || {})
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

    reader.onerror = function (err) {
        endCallback(err || {})
    }

    function readNext() {
        var fileSlice = file.slice(offset, offset + chunkSize)
        reader.readAsBinaryString(fileSlice)
    }
    readNext()
}

async function hashCreator(setArtHash) {
    var art = document.getElementById("art")

    if (!art.files.length) {
        console.log("You must select a file to certify first!")
    } else {
        process(setArtHash)
    }
}

export default hashCreator
