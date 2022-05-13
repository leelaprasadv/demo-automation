const LoginPage = require('../pages/login.page');
const CatalogPage = require('../pages/catalog.page');
const ProductPage = require('../pages/product.page');
const CartPage = require('../pages/cart.page');

describe('Add product to cart', () => {
  const products = [
    "1 LIGHT PENDANT", "12 Inches Round Rose Gold Frame Wall Mirror", "1200 mm (48 inch) High Speed Ceiling Fan (White)"
  ];

  it('should login with valid credentials', async () => {
    await LoginPage.open();
    await LoginPage.login(process.env.LOGIN_USERNAME, process.env.LOGIN_PASSWORD);
    await browser.pause(5000)
  });

  it('should clean up cart before tests', async () => {
    await CartPage.clearCart();
  });

  it('should add products to cart', async () => {
    for (const product of products) {
      await CatalogPage.open();
      await CatalogPage.selectProduct(product);
      await ProductPage.addProductToCart();
    }
    await CartPage.open();
    await browser.saveScreenshot('./test/screenShots/products-in-cart.png')
  });

  it('should teardown cart', async () => {
    await CartPage.clearCart();
  });

  it('should logout from application', async () => {
    await LoginPage.logout();
  });
});


