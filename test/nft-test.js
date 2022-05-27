// import ethers is not mandatory since its globally available but adding here to make it more explicity and intuitive
const { expect } = require("chai");
const { ethers } = require("hardhat");

const { BigNumber } = ethers;

/* test/nft-test.js */
describe("NFTMarket", function() {

  // todo find a way for Market, market, NFT, nft to be initialized as const
  let Market, market, NFT, nft, ownerSigner, sellerSigner, buyerSigner, otherSigners;

  before(async function() {
    /* deploy the marketplace */
    Market = await ethers.getContractFactory("NFTMarket")
    market = await Market.deploy()
    await market.deployed()
    marketAddress = market.address

    /* deploy the NFT contract */
    NFT = await ethers.getContractFactory("NFT")
    nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    nftContractAddress = nft.address;
    /* Get users */
    [ownerSigner, sellerSigner, buyerSigner, ...otherSigners] = await ethers.getSigners();

    
  })

  it("Should create and execute market sales", async function() {

    /* create two tokens */
    let sellerCreateNFTPromise = nft.connect(sellerSigner).createToken("https://www.mytokenlocation.com");
    const sellerTokenId = await getTokenIdOrItemIdFromTransaction(sellerCreateNFTPromise);

    let ownerCreateNFTPromise = nft.connect(ownerSigner).createToken("https://www.mytokenlocation2.com");
    const ownerTokenId = await getTokenIdOrItemIdFromTransaction(ownerCreateNFTPromise);

    /* put both tokens for sale */
    const auctionPrice = ethers.utils.parseUnits('1', 'ether');

    const createMarketItemPromise = market.connect(sellerSigner).createMarketItem(nftContractAddress, sellerTokenId, auctionPrice);
    const sellerItemId = await getTokenIdOrItemIdFromTransaction(createMarketItemPromise);
    await market.createMarketItem(nftContractAddress, ownerTokenId, auctionPrice);

    /* execute sale of token to another user */
    await market.connect(buyerSigner).createMarketSale(nftContractAddress, sellerItemId, { value: auctionPrice});

    // withdraw credits so that credit balance goes back to zero
    await market.connect(sellerSigner).withdrawCredits();
    await market.connect(ownerSigner).withdrawCredits();

    /* query for and return the unsold items */
    let unsoldItems = await market.fetchMarketItems()
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

  it ("Should give users the correct credits on item sale", async function() {
    const auctionPrice = ethers.utils.parseUnits('1.5', 'ether');

    let sellerCreateNFTPromise = nft.connect(sellerSigner).createToken("https://www.mytokenlocation.com");
    const sellerTokenId = await getTokenIdOrItemIdFromTransaction(sellerCreateNFTPromise);

    const createMarketItemPromise = market.connect(sellerSigner).createMarketItem(nftContractAddress, sellerTokenId, auctionPrice);
    const sellerItemId = await getTokenIdOrItemIdFromTransaction(createMarketItemPromise);

    /* execute sale of token to another user */
    await market.connect(buyerSigner).createMarketSale(nftContractAddress, sellerItemId, { value: auctionPrice})

    const expectedSalesFeeBasisPoints = 250;
    const basisPointsTotal = 10000;
    const salesFeeBasisPoints = await market.getSalesFeeBasisPoints(); // 2.5% in basis points (parts per 10,000) 250/100000

    const sellerAddressCredit = await market.getAddressCredits(sellerSigner.address);
    const buyerAddressCredit = await market.getAddressCredits(buyerSigner.address);
    const marketOwnerAddressCredit = await market.getAddressCredits(ownerSigner.address);


    expect(sellerAddressCredit.add(marketOwnerAddressCredit)).to.equal(auctionPrice);
    expect(buyerAddressCredit).to.equal(0);
    expect(salesFeeBasisPoints).to.equal(expectedSalesFeeBasisPoints);


    const expectedMarketPayment = (auctionPrice.mul(expectedSalesFeeBasisPoints)).div(basisPointsTotal);
    const expectedSellerPayment = auctionPrice.sub(expectedMarketPayment);
    expect(expectedSellerPayment).to.equal(sellerAddressCredit);
    expect(expectedMarketPayment).to.equal(marketOwnerAddressCredit);

    // changeEtherBalance ignores transaction fees by default:
    // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#change-ether-balance
    await expect(() => market.connect(ownerSigner).withdrawCredits()).to.changeEtherBalance(ownerSigner, marketOwnerAddressCredit);
    await expect(() => market.connect(sellerSigner).withdrawCredits()).to.changeEtherBalance(sellerSigner, sellerAddressCredit);
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
})
