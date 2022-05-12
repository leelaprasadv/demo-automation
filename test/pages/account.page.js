

const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class AccountPage extends Page {
    /**
     * define selectors using getter methods
     */
    
    /**
     * overwrite specific options to adapt it to page object
     */
    open() {
        return super.open('account');
    }
}

module.exports = new AccountPage();
