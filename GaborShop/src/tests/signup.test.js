const puppeteer = require("puppeteer");

jest.setTimeout(60000);

describe("Signup.jsx", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it("Failed signup with empty input fields", async () => {
    await page.goto("http://localhost:3000/signup");
    await page.click('button[type="submit"]');

    await page.waitForSelector("#name .input-error");
    const nameError = await page.$eval(
      "#name .input-error",
      (e) => e.textContent
    );
    expect(nameError).toContain("The name field is required");

    const emailError = await page.$eval(
      "#email .input-error",
      (e) => e.textContent
    );
    expect(emailError).toContain("The email field is required");

    const passwordError = await page.$eval(
      "#password .input-error",
      (e) => e.textContent
    );
    expect(passwordError).toContain("The password field is required");

    const countryError = await page.$eval(
      "#country .input-error",
      (e) => e.textContent
    );
    expect(countryError).toContain("The country field is required");
  });

  it("Successfull signup with valid input data", async () => {
    await page.goto("http://localhost:3000/signup", {
      waitUntil: "networkidle0",
    });

    await page.type('input[name="name"]', "Teszt Elek");
    await page.type('input[name="email"]', `teszt${Math.random()}@gmail.com`);
    await page.type('input[name="password"]', "1234");
    await page.type('input[name="password_confirmation"]', "1234");
    await page.select('select[name="country"]', "Hungary///99");
    await page.waitForSelector('select[name="state"]');
    await page.select('select[name="state"]', "Budapest///1064");
    await page.waitForSelector('select[name="city"]');
    await page.select('select[name="city"]', "Zugló");
    await page.type('input[name="address"]', "Main street 11");

    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    const url = page.url();
    expect(url).toContain("http://localhost:3000/profile");
  });

  afterAll(() => browser.close());
});
