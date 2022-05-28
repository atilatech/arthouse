// import ethers is not mandatory since its globally available but adding here to make it more explicity and intuitive
const { expect } = require("chai");
const { ethers } = require("hardhat");

const { BigNumber } = ethers;

const auctionPrice = ethers.utils.parseUnits('1.5', 'ether');

describe("NFTMarket", function() {

  let Market, market, NFT, nft, ownerSigner, sellerSigner, buyerSigner, otherSigners;

  before(async function() {
    /* deploy the marketplace */
    Market = await ethers.getContractFactory("NFTMarket")
    market = await Market.deploy()
    await market.deployed()
    marketAddress = market.address

    /* deploy the NFT contract */
    NFT = await ethers.getContractFactory("NFT")
    nft = await NFT.deploy();
    nft.setApprovalForAll(marketAddress, true);
    await nft.deployed()
    nftContractAddress = nft.address;
    /* Get users */
    [ownerSigner, sellerSigner, buyerSigner, ...otherSigners] = await ethers.getSigners();

    
  })

  describe("createMarketSale", function() {
    it("Should create and execute market sales", async function() {

      /* create two tokens */
      const { itemId: sellerItemId } = await createTokenAndMarketItem(sellerSigner);
      await createTokenAndMarketItem(ownerSigner);
  
      /* execute sale of token to another user */
      await market.connect(buyerSigner).createMarketSale(nftContractAddress, sellerItemId, { value: auctionPrice});
  
      // withdraw credits so that credit balance goes back to zero
      await market.connect(sellerSigner).withdrawCredits();
      await market.connect(ownerSigner).withdrawCredits();
  
      /* query for and return the unsold items */
      let unsoldItems = await market.fetchUnSoldMarketItems()
      unsoldItems = await Promise.all(unsoldItems.map(async i => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri
        }
        return item
      }));
      expect(unsoldItems.length).to.equal(1);
  
    })
    it("Should allow reselling an item multiple times", async function() {

      /* create token */
      const { itemId: originalItemId, tokenId } = await createTokenAndMarketItem(sellerSigner);
  
      /* execute sale of token to another user */
      const [firstBuyerSigner, secondBuyerSigner, thirdBuyerSigner] = otherSigners;

      // We could have done this in a for-loop but for the purpose of tests as documentation this might be more explicit and intuitive
      let originalBalance = await nft.balanceOf(firstBuyerSigner.address);
      await market.connect(firstBuyerSigner).createMarketSale(nftContractAddress, originalItemId, { value: auctionPrice});

      // Other tests may change the balance so originalBalance might not initially be zero, 
      // we  want to check that the balance increased by 1, instead of checking that it equals 1.
      expect(originalBalance+1).to.eq(await nft.balanceOf(firstBuyerSigner.address));

      /** New owner relists item */
      nft.connect(firstBuyerSigner).setApprovalForAll(marketAddress, true);
      let createMarketItemPromise = market.connect(firstBuyerSigner).createMarketItem(nftContractAddress, tokenId, auctionPrice);
      let resaleItemId = await getTokenIdOrItemIdFromTransaction(createMarketItemPromise);

      /** Second buyer buys relisted item */
      originalBalance = await nft.balanceOf(secondBuyerSigner.address);
      await market.connect(secondBuyerSigner).createMarketSale(nftContractAddress, resaleItemId, { value: auctionPrice});
      expect(originalBalance+1).to.eq(await nft.balanceOf(secondBuyerSigner.address));

      /** Repeat process of listing and buying item. This second buyer increases the auction price */
      const resaleAuctionPrice = ethers.utils.parseUnits('2.25', 'ether');
      nft.connect(secondBuyerSigner).setApprovalForAll(marketAddress, true);
      createMarketItemPromise = market.connect(secondBuyerSigner).createMarketItem(nftContractAddress, tokenId, resaleAuctionPrice);
      resaleItemId = await getTokenIdOrItemIdFromTransaction(createMarketItemPromise);

      /** Second buyer buys relisted item */
      originalBalance = await nft.balanceOf(thirdBuyerSigner.address);
      await market.connect(thirdBuyerSigner).createMarketSale(nftContractAddress, resaleItemId, { value: resaleAuctionPrice});
      expect(originalBalance+1).to.eq(await nft.balanceOf(thirdBuyerSigner.address));

  
    })
  })

  describe("withdrawCredits", function() {

    it ("Should give users the correct credits on item sale", async function() {
  
      let sellerCreateNFTPromise = nft.connect(sellerSigner).createToken("https://www.mytokenlocation.com");
      const sellerTokenId = await getTokenIdOrItemIdFromTransaction(sellerCreateNFTPromise);
  
      const createMarketItemPromise = market.connect(sellerSigner).createMarketItem(nftContractAddress, sellerTokenId, auctionPrice);
      const sellerItemId = await getTokenIdOrItemIdFromTransaction(createMarketItemPromise);
  
      /* execute sale of token to another user */
      await market.connect(buyerSigner).createMarketSale(nftContractAddress, sellerItemId, { value: auctionPrice})
  
      const sellerAddressCredit = await market.getAddressCredits(sellerSigner.address);
      const buyerAddressCredit = await market.getAddressCredits(buyerSigner.address);
      const marketOwnerAddressCredit = await market.getAddressCredits(ownerSigner.address);
  
      expect(buyerAddressCredit).to.equal(0);
  
      // changeEtherBalance ignores transaction fees by default:
      // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#change-ether-balance
      await expect(() => market.connect(ownerSigner).withdrawCredits()).to.changeEtherBalance(ownerSigner, marketOwnerAddressCredit);
      await expect(() => market.connect(sellerSigner).withdrawCredits()).to.changeEtherBalance(sellerSigner, sellerAddressCredit);
    })

  })
  
  describe("unListMarketItem", function() {
    let sellerTokenId, sellerItemId;

    beforeEach(async function() { 

      let { tokenId, itemId } = await createTokenAndMarketItem(sellerSigner);
      sellerTokenId = tokenId;
      sellerItemId = itemId;
      
    });

    it ("should not allow buying of unlisted item", async function() {
      // ownerSigner is connected by default, .connect(ownerSigner) is used just to be explicit
      await market.connect(sellerSigner).unListMarketItem(nftContractAddress, sellerItemId);
      await expect(market.connect(buyerSigner).createMarketSale(nftContractAddress, sellerItemId, { value: auctionPrice}))
      .to.be.revertedWith("This item is not available for sale");
    });

    it ("should not allow non-seller to unlist", async function() {
      // ownerSigner is connected by default, .connect(ownerSigner) is used just to be explicit
      await expect(market.connect(ownerSigner).unListMarketItem(nftContractAddress, sellerItemId))
      .to.be.revertedWith("Only seller may unlist an item");
    });

    it ("should remove unlisted item from list of market items", async function() {

      const { itemId } = await createTokenAndMarketItem(sellerSigner);
      let unsoldItems = await market.fetchUnSoldMarketItems();
      const originalUnsoldItemsCount = unsoldItems.length;

      await market.connect(sellerSigner).unListMarketItem(nftContractAddress, itemId);

      unsoldItems = await market.fetchUnSoldMarketItems();

      expect(originalUnsoldItemsCount-1).to.equal(unsoldItems.length);

    });

    it ("should allow relisting item after unlisting", async function() {

      let { itemId } = await createTokenAndMarketItem(sellerSigner);
      await market.connect(sellerSigner).unListMarketItem(nftContractAddress, itemId);
      let unsoldItems = await market.fetchUnSoldMarketItems();
      const originalUnsoldItemsCount = unsoldItems.length;

      await nft.connect(sellerSigner).setApprovalForAll(marketAddress, true);
      await market.connect(sellerSigner).createMarketItem(nftContractAddress, sellerTokenId, auctionPrice);

      unsoldItems = await market.fetchUnSoldMarketItems();

      expect(originalUnsoldItemsCount+1).to.equal(unsoldItems.length);
    });
  })

  describe("fetchMarketItems", function() {

    it ("should have all created items", async function() {
      
    
      const originalMarketItems = await market.fetchMarketItems();
      const {itemId: sellerItemId} = await createTokenAndMarketItem(sellerSigner);
      await market.connect(sellerSigner).unListMarketItem(nftContractAddress, sellerItemId);
      await createTokenAndMarketItem(buyerSigner);
      await createTokenAndMarketItem(sellerSigner);

      const updatedMarketItems = await market.fetchMarketItems();
      expect(originalMarketItems.length + 3).to.eq(updatedMarketItems.length);

    });
    

  })

  /**
   * Parse the transaction logs to get the tokenId returned from the function call
   * @param {*} transactionPromise 
   * @returns 
   */
  async function getTokenIdOrItemIdFromTransaction(transactionPromise) {
    transactionPromise = await transactionPromise;
    const transaction = await transactionPromise.wait()
    const event = transaction.events[0];
    let value = event.topics[3]
    value = BigNumber.from(value)
    // We usually shouldn't convert BigNumber toNumber() but this is okay since we don't expect the tokenId or itemId to be very large in our tests
    return value.toNumber()
  }

  async function createTokenAndMarketItem(signer) {

    let createNFTPromise = nft.connect(signer).createToken("https://www.mytokenlocation.com");
    const tokenId = await getTokenIdOrItemIdFromTransaction(createNFTPromise);

    await nft.connect(signer).setApprovalForAll(marketAddress, true);

    const createMarketItemPromise = market.connect(signer).createMarketItem(nftContractAddress, tokenId, auctionPrice);
    const itemId = await getTokenIdOrItemIdFromTransaction(createMarketItemPromise);

    return {
      tokenId,
      itemId
    }
  }
})
