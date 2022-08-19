const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")
console.log("Token URI uploaded!:")
const imagesFilePath = "./images/chillingMollyNft"
let tokenUri = []

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100,
        },
    ],
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUri = await handleTokenUris()
    }
    const arguments = tokenUri
    const chillingMollyNft = await deploy("ChillingMollyNft", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    console.log("r")
    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(chillingMollyNft.address, arguments)
    }
}

const handleTokenUris = async () => {
    let tokenUri = []
    const { responses: imageUploadRespones, files } = await storeImages(imagesFilePath)
    for (imageUploadResponesIndex in imageUploadRespones) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponesIndex].replace("png", "")
        tokenUriMetadata.description = `${tokenUriMetadata.name} likes to eat and chill!`
        tokenUriMetadata.image = `ipfs://${imageUploadRespones[imageUploadResponesIndex].IpfsHash}`
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUri.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URI uploaded!:")
    console.log(tokenUri)
    return tokenUri
}
module.exports.tags = ["all", "chillingMollyNft", "main"]
