const { GoogleSpreadsheet } = require("google-spreadsheet");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

const doc = new GoogleSpreadsheet(
  "1ruB6ZFNyvG1b_auGfY5418XRwQKZXUdO_IvCnXXqOuo"
);

const init = async () => {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });
};

const read = async () => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle.Translation;
  await sheet.loadHeaderRow();
  const colTitles = sheet.headerValues;
  const rows = await sheet.getRows({ limit: sheet.rowCount });
  let result = {};
  rows.map((row) => {
    colTitles.slice(1).forEach((title) => {
      result[title] = result[title] || [];
      const key = row[colTitles[0]];
      result = {
        ...result,
        [title]: {
          ...result[title],
          [key]: row[title] !== "" ? row[title] : undefined,
        },
      };
    });
  });
  return result;
};

function parseDotNotation(str, val, obj) {
  let currentObj = obj;
  const keys = str.split(".");
  let i;
  const l = Math.max(1, keys.length - 1);
  let key;

  for (i = 0; i < l; ++i) {
    key = keys[i];
    currentObj[key] = currentObj[key] || {};
    currentObj = currentObj[key];
  }

  currentObj[keys[i]] = val;
  delete obj[str];
}

Object.expand = function (obj) {
  for (const key in obj) {
    if (key.indexOf(".") !== -1) {
      parseDotNotation(key, obj[key], obj);
    }
  }
  return obj;
};

const write = (data) => {
  Object.keys(data).forEach((key) => {
    const tempObject = Object.expand(data[key]);
    fs.writeFile(
      `./public/locales/${key}/translation.json`,
      JSON.stringify(tempObject, null, 2),
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  });
};

init()
  .then(() => read())
  .then((data) => write(data))
  .catch((err) => console.log("ERROR!!!!", err));
