const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ProductPage extends Page {
    /**
     * define selectors using getter methods
     */
    get lblProductName () {
        return $('.product-single__title');
    }

    get lblProductPrice () {
        return $('#ProductPrice');
    }

    get btnAddToCart () {
        return $('#AddToCart');
    }

    get btnBuyNow () {
        return $('button=Buy it now');
    }

    get btnAddToWishlist () {
      return $('.swym-wishlist-cta');
    }

    async addProductToCart () {
        await this.btnAddToCart.click();
    }
}

module.exports = new ProductPage();
