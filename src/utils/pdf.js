const path = require("path");
const fs = require("fs");
const fsp = require("fs").promises;
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const moment = require("moment");


const getPdf = async (html, options = { format: "A4", printBackground: true }) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);

  
  const pdf = await page.pdf(options);
  await browser.close();

  return pdf;
};
// const templatesPath = isDev
//   ? path.join(process.cwd(), "src/reports")
//   : path.join(process.cwd(), "reports");
const templatesPath = path.join(process.cwd(), "src/docs");

const hbs = handlebars.create({
  defaultLayout: false,
});

const buildReport = async (template, data, fileName) => {
  const getTemplate = async (template) => {
    const templatePath = path.join(templatesPath, template);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found ${template}`);
    }
    const file = await fsp.readFile(templatePath, "utf-8");
    return file;
  };

  const t = await getTemplate(template);
  const html = hbs.compile(t)(data);
  console.log(data)

  const pdf = await getPdf(html, { format: "A4", printBackground: true });
  const documentsDir = path.join(process.cwd(), "src/documents");
  if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir);
  }
  fs.writeFileSync(path.join(documentsDir, `${fileName}.pdf`), pdf);

  return pdf;
};

const registerHelpers = (hbs) => {
  hbs.registerHelper("uppercase", function (ctx) {
    return ctx?.toUpperCase();
  });

  hbs.registerHelper("date", function (ctx) {
    return ctx ? moment(ctx).format("DD/MM/YYYY") : "";
  });

  hbs.registerHelper("datetime", function () {
    return moment(this).format("DD/MM/YYYY HH:mm:ss");
  });

  hbs.registerHelper("current_year", function () {
    return moment().year();
  });

  hbs.registerHelper("current_month", function () {
    return moment().month();
  });

  hbs.registerHelper("current_day", function () {
    return moment().day();
  });

  hbs.registerHelper("currency", function (ctx) {
    return new Intl.NumberFormat().format(ctx);
  });
};

//register helpers
registerHelpers(hbs);

module.exports = buildReport;
