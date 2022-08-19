const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

describe("Basic nft unit test", function () {
    let basicNft, deplopyer

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        await deployments.fixture(["basicnft"])
        basicNft = await ethers.getContract("BasicNft")
    })

    describe("Constructor", () => {
        it("It intializes the constructor correctly", async () => {
            const name = await basicNft.name()
            const symbol = await basicNft.symbol()
            const tokenCounter = await basicNft.getTokenCounter()
            assert.equal(name, "Kitty")
            assert.equal(symbol, "Cat")
            assert.equal(tokenCounter.toString(), "0")
        })
    })

    describe("Mint Nft", () => {
        it("Allows users to mint an NFT, and updates appropriately", async () => {
            const txResponse = await basicNft.mintNft()
            await txResponse.wait(1)
            const tokenCounter = await basicNft.getTokenCounter()
            const tokenUri = await basicNft.tokenURI(0)
            assert.equal(tokenCounter.toString(), "1")

            assert.equal(tokenUri, await basicNft.TOKEN_URI())
        })
    })
})
