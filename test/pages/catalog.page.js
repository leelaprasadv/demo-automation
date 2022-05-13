

const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CatalogPage extends Page {
    /**
     * define selectors using getter methods
     */
    get getAllProducts() {
        return $('#CollectionSection div.grid-uniform');
    }

    get products() {
        return $$('#CollectionSection .grid-link')
    }

    get inputPassword() {
        return $('#CustomerPassword');
    }

    get btnAddToWishList() {
        return 'button[data-swaction="addToWishlist"]';
    }

    get btnAddToListConfirm() {
        return $('button=Add To List')
    }

    get titleWishlistDialog() {
        return $('.swym-wishlist-items-title')
    }

    get btnCreateNewWishList() {
        return $('.swym-new-wishlist-btn')
    }

    get inputNewWishlist() {
        return $('input[aria-label="Create New List Input"]')
    }

    getProductByName(productName) {
        return $(`p*=${productName}`).parentElement();
    }

    selectWishlistByName(wishlistName) {
        return $(`button[aria-label="${wishlistName}"] span.swym-icon`);
    }

    waitForWishlistDialog() {
        return this.titleWishlistDialog.waitForExist({ timeout: 10000 });
    }

    async addToWishlist(productName, wishlist) {
        const product = await this.getProductByName(productName);
        await product.$(this.btnAddToWishList).click();
        await this.waitForWishlistDialog();
        let isExisting = await this.selectWishlistByName(wishlist).isExisting();

        // console.log(await $('.swym-wishlist-items').value.length);
        if (!isExisting) {
            await this.btnCreateNewWishList.click();
            await this.inputNewWishlist.setValue(wishlist);
        } else {
            await this.selectWishlistByName(wishlist).click();
        }
        await this.btnAddToListConfirm.click();
        browser.saveScreenshot('./test/screenShots/addtowishlist.png')
    }

    async selectProduct(productName) {
        const product = await this.getProductByName(productName);
        await product.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    async open() {
        await super.open('collections/all');
        await browser.pause(5000);
    }

    gotoPage(pageNumber = 1) {
        return super.open(`collections/all?page=${pageNumber}`);
    }


}

module.exports = new CatalogPage();



