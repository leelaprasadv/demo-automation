

const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CatalogPage extends Page {
    /**
     * define selectors using getter methods
     */
    get getAllProducts () {
        return $('#CollectionSection div.grid-uniform');
    }

    get products () {
        return $$('#CollectionSection .grid-link')
    }

    get inputPassword () {
        return $('#CustomerPassword');
    }

    get btnAddToWishList () {
        return 'button[data-swaction="addToWishlist"]';
    }

    get btnAddToListConfirm () {
        return $('button=Add To List')
    }

    get titleWishlistDialog () {
        return $('.swym-wishlist-items-title')
    }

    get btnCreateNewWishList () {
        return $('.swym-new-wishlist-btn')
    }

    getProductByName (productName) {
        return $(`p*=${productName}`).parentElement();
    }

    selectWishlistByName (wishlistName) {
        return $(`button[aria-label="${wishlistName}"] span.swym-icon`);
    }

    waitForWishlistDialog () {
        return this.titleWishlistDialog.waitForExist({ timeout: 10000 });
    }

    async addToWishlist(productName, wishlist) {
        const product = await this.getProductByName(productName);
        await product.$(this.btnAddToWishList).click();
        await this.waitForWishlistDialog();
        let isExisting = await this.selectWishlistByName(wishlist).isExisting();
        // console.log(await $('.swym-wishlist-items').value.length);
        if (isExisting) {
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
    open () {
        return super.open('collections/all');
    }

    gotoPage(pageNumber=1) {
      return super.open(`collections/all?page=${pageNumber}`);
    }


}

module.exports = new CatalogPage();



