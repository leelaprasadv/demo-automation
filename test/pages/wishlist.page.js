

const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class WishlistPage extends Page {
  /**
   * define selectors using getter methods
   */
  get tabWishlist() {
    return $('.swym-htc-tab-item.swym-tab-wishlist');
  }

  get lblAllWishlistNames() {
    return $$('.swym-wishlist-name')
  }

  get tabSaveForLater() {
    return $('.swym-htc-tab-item.swym-tab-sfl');
  }

  get lblSelectedWishList() {
    return $('span.swym-selected-wishlist-label');
  }

  get btnMoreOptions() {
    return $('button.swym-wishlist-context-menu[aria-label="More Options"]');
  }

  get menuOptionContextMenu() {
    return $('.swym-wishlist-context-menu-content');
  }

  get mdlClearWishlist() {
    return $('.swym-clear-wishlist-modal-dialog');
  }

  get btnClearWishlistConfirm() {
    return $('.swym-clear-wishlist-btn')
  }

  get btnClearWishlistCancel() {
    return $('.swym-cancel-clear-wishlist-btn')
  }

  get btnCloseWishlistShareDialog() {
    return $('button.swym-close-btn[area-label="Close Modal"]')
  }

  get mdlShareListViaEmail() {
    return $(`h2=Share List via Email`);
  }

  get inputEmailSender() {
    return $('#swym-name');
  }

  get inputRecepientEmail() {
    return $('#swym-email');
  }

  get inputEmailMessage() {
    return $('#swym-note');
  }

  get btnShareList() {
    return $('.swym-share-wishlist-email-btn');
  }

  get lstWishListItems() {
    return $$('a.swym-wishlist-item');
  }

  btnSelectOption(optionName) {
    return $(`button.swym-wishlist-context-menu-item[aria-label="${optionName}"]`)
  }

  waitForWishlistDialog() {
    return this.titleWishlistDialog.waitForExist({ timeout: 10000 });
  }

  confirmDeleteWishlist() {
    return this.btnClearWishlistConfirm.click();
  }

  cancelDeleteWishlist() {
    return this.btnClearWishlistCancel.click();
  }

  async fillShareWishlistForm(email, message, senderName) {
    if (senderName) {
      await this.inputEmailSender.setValue(senderName);
    }
    await this.inputRecepientEmail.setValue(email);
    await this.inputEmailMessage.setValue(message);
  }

  async shareWishlist(email, message) {
    const option = 'Share';
    await this.openMoreOptions();
    await this.btnSelectOption(option).click();
    await this.mdlShareListViaEmail.waitForExist({ timeout: 10000 });
    await this.fillShareWishlistForm(email, message);
    await this.btnShareList.click();
    await this.btnCloseWishlistShareDialog.click();
  }

  async openWishlistByName(wishlistName) {
    await $(`button.swym-wishlist-list-card[aria-label="${wishlistName}"]`).click();
    await this.lblSelectedWishList.waitForExist({ timeout: 10000 })
  }

  async openMoreOptions() {
    await this.btnMoreOptions.click();
    await this.menuOptionContextMenu.waitForExist({ timeout: 10000 })
  }

  async deleteWishlist(wishlistName) {
    await this.openWishlistByName(wishlistName);
    const option = 'Delete List';
    await this.openMoreOptions();
    await this.btnSelectOption(option).click();
    await this.mdlClearWishlist.waitForExist({ timeout: 10000 });
    await this.confirmDeleteWishlist();
  }

  async getAllWishlistNames() {
    let wishlistNames = [];
    for (const wishlistName of await this.lblAllWishlistNames) {
      wishlistNames.push(await wishlistName.getText());
    }
    return wishlistNames;
  }

  async purgeAllWishlists() {
    await this.open();
    const wishlists = await this.getAllWishlistNames();

    for (const wishlist of wishlists) {
      await this.deleteWishlist(wishlist);
    }
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

  async getWishListItems(wishlist) {
    const wishlistItems = []
    await this.open();
    await this.openWishlistByName(wishlist);
    for (const item of await this.lstWishListItems) {
      wishlistItems.push({
        "product": await item.$('button .swym-title').getText(),
        "price": await item.$('.swym-product-final-price').getText()
      })
    }
    return wishlistItems.reverse();
  }

  /**
   * overwrite specific options to adapt it to page object
   */
  open() {
    return super.open('pages/wishlist3');
  }
}

module.exports = new WishlistPage();



