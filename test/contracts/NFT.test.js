// import ethers is not mandatory since its globally available but adding here to make it more explicity and intuitive
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

const DEFAULT_URI = "https://www.mytokenlocation.com";
describe("NFT", function() {

  let NFT, nft, ownerSigner, secondNFTSigner;

  before(async function() {
    /* deploy the NFT contract */
    NFT = await ethers.getContractFactory("NFT")
    nft = await NFT.deploy();
    await nft.deployed()
    nftContractAddress = nft.address;
    /* Get users */
    [ownerSigner, secondNFTSigner, ...otherSigners] = await ethers.getSigners();
    
  })

  describe("createToken", function() {
    it("Emit NFTMinted event", async function() {
        await expect(nft.connect(ownerSigner).createToken(DEFAULT_URI)).to.emit(nft, 'NFTMinted').withArgs(1, DEFAULT_URI);

    })
    it("Should update the balances", async function() {

        await expect(() => nft.connect(ownerSigner).createToken(DEFAULT_URI))
          .to.changeTokenBalance(nft, ownerSigner, 1);

        await expect(() => nft.connect(secondNFTSigner).createToken(DEFAULT_URI))
          .to.changeTokenBalance(nft, secondNFTSigner, 1);

    })


    it("Returns the tokenId", async function() {
      const createTokenResponse = await nft.connect(ownerSigner).createToken(DEFAULT_URI);
      const tokenId = await getNumberFromTransactionResponse(createTokenResponse);
      expect(tokenId).to.be.greaterThanOrEqual(1);

  })
  })

  describe("createTokenOnBehalfOf", function() {
    it("Emit NFTMinted event", async function() {
        // TODO find a way to do partial match of arguements in withArgs e.g. .withArgs(sinon.match.any, DEFAULT_URI);
        // current use of sinon.match.any gives the following error: Error: invalid BigNumber value (argument="value", value={"message":"any"}, code=INVALID_ARGUMENT, version=bignumber/5.5.0)
        // await expect(nft.connect(ownerSigner).createTokenOnBehalfOf(DEFAULT_URI, secondNFTSigner.address)).to.emit(nft, 'NFTMinted').withArgs(DEFAULT_URI);
        await expect(nft.connect(ownerSigner).createTokenOnBehalfOf(DEFAULT_URI, secondNFTSigner.address)).to.emit(nft, 'NFTMinted')

    })
    it("Should update the balances", async function() {

        await expect(() => nft.connect(ownerSigner).createTokenOnBehalfOf(DEFAULT_URI, secondNFTSigner.address))
          .to.changeTokenBalances(nft, [ownerSigner, secondNFTSigner], [0, 1]);

    })

    it("Returns the tokenId", async function() {
      const createTokenResponse = await nft.connect(ownerSigner).createTokenOnBehalfOf(DEFAULT_URI, secondNFTSigner.address);
      const tokenId = await getNumberFromTransactionResponse(createTokenResponse);
      expect(tokenId).to.be.greaterThanOrEqual(1);

  })
  })
})


/**
 * Parse the transaction logs to get the tokenId returned from the function call
 * @param {*} transactionPromise 
 * @returns 
 */
async function getNumberFromTransactionResponse(transactionPromise) {
  transactionPromise = await transactionPromise;
  const transaction = await transactionPromise.wait()
  const event = transaction.events[0];
  let value = event.topics[3]
  value = BigNumber.from(value)
  // We usually shouldn't convert BigNumber toNumber() but this is okay since we don't expect the tokenId or itemId to be very large in our tests
  return value.toNumber()
}

module.exports = {
  getNumberFromTransactionResponse
}
