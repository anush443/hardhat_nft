const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")

const imagesFilePath = "./images/chillingMollyNft"
let tokenUri = ["ipfs://QmPVu4La4keko51GEGdqx13mcWQ3ft4twVaeXhZ1hN3HRW"]

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
    const chainId = network.config.chainId
    log("----------------------------------------------------")
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUri = await handleTokenUris()
    }
    const mintFee = networkConfig[chainId]["mintFee"]
    const arguments = [...tokenUri, mintFee]
    console.log(arguments)

    const chillingMollyNft = await deploy("ChillingMollyNft", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(chillingMollyNft.address, arguments)
    }
}

const handleTokenUris = async () => {
    let tokenUri = []
    const { responses: imageUploadResponses, files } = await storeImages(imagesFilePath)

    for (imageUploadResponsesIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponsesIndex].replace(".png", "")
        tokenUriMetadata.description = `${tokenUriMetadata.name} likes to eat and chill!!!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponsesIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name} metadata...`)
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)

        tokenUri.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URI uploaded!")
    console.log(tokenUri)
    return tokenUri
}

module.exports.tags = ["all", "chillingMollyNft", "main"]
