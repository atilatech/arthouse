// import ethers is not mandatory since its globally available but adding here to make it more explicity and intuitive
const { expect } = require("chai");
const { ethers } = require("hardhat");

const DEFAULT_URI = "https://www.mytokenlocation.com";
describe("NFT", function() {

  let NFT, nft,nftContractAddress, ownerSigner, secondNFTSigner;

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
  })
})
