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

        let originalBalance = await nft.balanceOf(ownerSigner.address);
        await nft.connect(ownerSigner).createToken(DEFAULT_URI);

        // Other tests may change the balance so originalBalance might not initially be zero, 
        // Therefore, want to check that the balance increased by 1, instead of checking that it equals 1.
        expect(originalBalance.toNumber()+1).to.eq(await nft.balanceOf(ownerSigner.address));

        originalBalance = await nft.balanceOf(secondNFTSigner.address);
        await nft.connect(secondNFTSigner).createToken(DEFAULT_URI);

        expect(originalBalance.toNumber()+1).to.eq(await nft.balanceOf(secondNFTSigner.address));


    })
  })
})
