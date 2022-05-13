const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class CartPage extends Page {
    /**
     * define selectors using getter methods
     */

    get cartSection() {
        return $('#CartSection');
    }

    get cartItemsCleanAttrs() {
        return $$('.grid__item.two-thirds');
    }

    get inputQuantity() {
        return $('input[aria-label="Quantity"]')
    }

    get btnCheckout() {
        return $('button[name="checkout"]');
    }

    get btnRemoveFromCart() {
        return '.cart__remove';
    }

    get lblCartEmpty() {
        return $('.cart--empty-message');
    }

    async getCartItemByName(productName) {
        return $(`h2=${productName}`).parentElement().parentElement().parentElement();
    }

    async removeItemByName(productName) {
        const cartItem = await this.getCartItemByName(productName);
        await cartItem.$(this.btnRemoveFromCart).click();
    }

    async verifyCartEmpty() {
        expect(this.lblCartEmpty).toBeDisplayed();
        expect(this.lblCartEmpty).toHaveText("Your cart is currently empty.");
    }

    async clearCart() {
        await this.open();
        for (const cartItem of await this.cartItemsCleanAttrs) {
            await cartItem.$(this.btnRemoveFromCart).click()
        }
        await this.verifyCartEmpty();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    open() {
        return super.open('cart');
    }

}

module.exports = new CartPage();
