const path = require("path");
const fs = require("fs");
const fsp = require("fs").promises;
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const moment = require("moment");
const { convertImageToBase64 } = require("./convertImageToBase64");

const getPdf = async (
  html,
  options = { format: "A4", printBackground: true }
) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
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

const buildReport = async (template, data, fileName, images) => {
  const getTemplate = async (template) => {
    const templatePath = path.join(templatesPath, template);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found ${template}`);
    }
    return await fsp.readFile(templatePath, "utf-8");
  };

  const convertImagesToBase64 = async (imagePaths) => {
    return await Promise.all(
      imagePaths.map(async (imagePath) => {
        const resolvedPath = path.resolve(imagePath);
        return await convertImageToBase64(resolvedPath);
      })
    );
  };

  const base64Images = images && images.length > 0
    ? await convertImagesToBase64(images)
    : null;

  data.images = base64Images;

  console.log(data.images)
  const t = await getTemplate(template);
  const html = hbs.compile(t)(data);

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
