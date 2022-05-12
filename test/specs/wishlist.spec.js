const LoginPage = require('../pages/login.page');
const CatalogPage = require('../pages/catalog.page');
const WishlistPage = require('../pages/wishlist.page');
const imapEmail = require('../../lib/imap.email');

describe('Add products to wishlist and share wishlist via email', () => {
    const wishlistMsg = 'Hello!! Check out my wishlist of products..';
    const wishlistName = 'My Wishlist'
    let addedWishlistItems = [];
    let emailResults = [];

    it('should login with valid credentials', async () => {
        await LoginPage.open();
        await LoginPage.login(process.env.LOGIN_USERNAME, process.env.LOGIN_PASSWORD);
        await browser.pause(5000)
    });

    it('should cleanup wishlists', async () => {
        await WishlistPage.purgeAllWishlists();
    })
    
    it('should add products to wishlist', async () => {
        await CatalogPage.open();
        await CatalogPage.addToWishlist("1 LIGHT PENDANT", wishlistName);
        await CatalogPage.addToWishlist("12 Inches Round Rose Gold Frame Wall Mirror", wishlistName);
        await CatalogPage.addToWishlist("1200 mm (48 inch) High Speed Ceiling Fan (White)", wishlistName);
    });

    it('should open and share wishlist', async () => {
        await WishlistPage.open();
        await WishlistPage.openWishlistByName(wishlistName);
        await browser.saveScreenshot('./test/screenShots/openwishlist.png');
        await WishlistPage.shareWishlist(process.env.EMAIL_USER, wishlistMsg);
        addedWishlistItems = await WishlistPage.getWishListItems(wishlistName);
        // console.log(addedWishlistItems);
    })

    it('should send email with wishlisted products and verify results', async () => {
        await imapEmail.connect();
        await imapEmail.openBox("INBOX");
        emailResults = await imapEmail.getMailContent(true, criteria = ['UNSEEN', ['FROM', "swym-marketing.myshopify.com@swymrelay.com"]]);
        // console.log("results: ", emailResults);
        await imapEmail.closeConnection();
    });

    it('should verify wishlist added and emailed wishlist products', () => {
        // verify email attributes
        expect(emailResults.from).toEqual("Swym Demo Store <swym-marketing.myshopify.com@swymrelay.com>");
        expect(emailResults.to).toEqual(process.env.EMAIL_USER);
        expect(emailResults.replyTo).toEqual("marketing@swymcorp.com");
        expect(emailResults.subject).toEqual(`${process.env.LOGIN_USERNAME} has a Swym Marketing list to share`);
        expect(emailResults.greetingMsg).toEqual(`Hi there! ${process.env.LOGIN_USERNAME} has shared their wishlist with you.`);
        expect(emailResults.usrCustomMsg).toEqual(`${JSON.parse(`["\\u201C"]`)[0]} ${wishlistMsg} ${JSON.parse(`["\\u201D"]`)[0]}`);

        expect(addedWishlistItems.length).toEqual(emailResults.products.length);
        // verify products in wishlist and in email
        for (let iter=0; iter < addedWishlistItems.length; iter++) {
            expect(addedWishlistItems[iter].product).toEqual(emailResults.products[iter].product);
            expect(addedWishlistItems[iter].price).toEqual(emailResults.products[iter].price);
        }
    });

    it('should teardown wishlist', async () => {
        await WishlistPage.open();
        await WishlistPage.deleteWishlist(wishlistName);
    });

    it('should logout from application', async () => {
        await LoginPage.logout();
    });
});


