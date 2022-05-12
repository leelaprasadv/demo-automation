const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputUsername () {
        return $('#CustomerEmail');
    }

    get inputPassword () {
        return $('#CustomerPassword');
    }

    get btnSubmit () {
        return $('input[value="Sign In"]');
    }

    get btnLogOut () {
        return $('#customer_logout_link');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login (username, password) {

        if (typeof username === 'undefined' || typeof password === 'undefined') {
            throw new Error("Login Username/Password is cannot be empty");
        }
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await browser.pause(1000)
        await this.btnSubmit.click();
        await browser.saveScreenshot('./test/screenShots/login.png');
    }

    async logout () {
        await this.btnLogOut.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    open () {
        return super.open('account/login');
    }

    logOutUrl () {
        return super.open('account/logout');
    }
}

module.exports = new LoginPage();
