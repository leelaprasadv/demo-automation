const imaps = require('imap-simple');
const cheerio = require('cheerio');
const simpleParser = require('mailparser').simpleParser;
const { READ_MAIL_CONFIG } = require('../config');
const waitForEvent = require('wait-for-event-promise');

class ImapEmail {
  constructor() {
    this.mailResult = {};
    this.connection = null;
    this.emailSearchResults = [];
    this.retry_count = process.env.EMAIL_RETRY_COUNT || 3;
    this.email_read_timeout = process.env.EMAIL_READ_TIMEOUT || 20000;
    this.setDefaults();
  }

  setDefaults() {
    this.mailResult = {
      date: "",
      to: "",
      from: "",
      replyTo: "",
      subject: "",
      greetingMsg: "",
      usrCustomMsg: "",
      products: []
    };
    this.emailSearchResults = [];
  }

  async connect() {
    try {
      console.log('Fetching the newly send mail', new Date().toString());
      this.connection = await imaps.connect(READ_MAIL_CONFIG);
      console.log('CONNECTION SUCCESSFUL', new Date().toString());
    } catch (error) {
      console.log('CONNECTION FAILED!', error);
    }
  }

  async openBox(boxName = "INBOX") {
    try {
      const box = await this.connection.openBox(boxName.trim().toUpperCase());
    } catch (error) {
      console.log('CONNECTION FAILED!', error);
    }
  }

  async readMails(markSeen = false, criteria = ['UNSEEN']) {
    try {
      const searchCriteria = criteria;
      const fetchOptions = {
        bodies: ['HEADER', 'TEXT', ''],
        markSeen: markSeen,
      };
      this.emailSearchResults = await this.connection.search(searchCriteria, fetchOptions);
    } catch (error) {
      console.log('Email Search failed!', error);
    }
    return this.emailSearchResults
  }

  async waitForEmail() {
    // wait for ms before rejecting
    try {
      await waitForEvent(this.connection, 'mail', { timeout: this.email_read_timeout });
    } catch (err) {
      // after 20000 ms has passed
      if (err.message !== "Timed out waiting for event") {
        console.log(err);  // err.message === "Timed out waiting for event"
      }
    }
  }

  async getMailContent(markSeen = false, criteria = ['UNSEEN']) {
    let retryCounter = 1;
    try {
      while (retryCounter <= this.retry_count) {
        await this.waitForEmail();
        await this.readMails(markSeen, criteria);
        if (this.emailSearchResults.length === 0) {
          console.log("No emails with the search criteria, retrying...", criteria);
          this.setDefaults();
          retryCounter++;
          continue;
        }
        for (const res of this.emailSearchResults) {
          const textResp = res.parts.filter((part) => {
            return part.which === '';
          });
          const emailText = await simpleParser(textResp[0].body);
          const $ = cheerio.load(emailText.html);
          this.mailResult.greetingMsg = $('#mainimage span h4').text();
          this.mailResult.usrCustomMsg = $('#mainimage span h3').text(); // JSON.parse(`["\\u201C"]`)[0] + msg + JSON.parse(`["\\u201D"]`)[0]
          this.mailResult.to = emailText.to.text;
          this.mailResult.date = emailText.date;
          this.mailResult.subject = emailText.subject;
          this.mailResult.from = emailText.from.text;
          this.mailResult.replyTo = emailText.replyTo.text;

          for (const ele of $('tbody tr td p a')) {
            const productItem = $(ele).text().trim().split("$");
            const productUrl = $(ele).attr('href');
            this.mailResult.products.push({
              product: productItem[0],
              price: `$${productItem[1]}`,
              productUrl: productUrl
            })
          }
        }
        break;
      }
      return this.mailResult
    } catch (error) {
      console.log('Failed to get email content!', error);
    }
  }

  async closeConnection() {
    console.log("Disconnecting from Imap Email server...")
    await this.connection.end();
  }
}

module.exports = new ImapEmail();