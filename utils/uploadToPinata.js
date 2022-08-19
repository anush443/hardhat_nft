const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_SECERET
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

const storeImages = async (imagesFilePath) => {
    const imagesFullPath = path.resolve(imagesFilePath)
    console.log(imagesFullPath)
    const files = fs.readdirSync(imagesFullPath)

    //console.log(files)
    let responses = []
    for (filesIndex in files) {
        //console.log(`${imagesFullPath}/${files[filesIndex]}`)
        const readableStreamforFile = fs.createReadStream(`${imagesFullPath}/${files[filesIndex]}`)
        try {
            const response = await pinata.pinFileToIPFS(readableStreamforFile)

            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

const storeTokenUriMetadata = async (metadata) => {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}
module.exports = { storeImages, storeTokenUriMetadata }
