const { GoogleSpreadsheet } = require("google-spreadsheet");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

//# Initialize the sheet
const doc = new GoogleSpreadsheet(
  "1EVjoI9Y3mWkN0Wiz_3-E0hCXOvBbvlf_cKLqiR8h-Gk"
); //# spreadsheet ID

//# Initialize Auth
const init = async () => {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });
};

const traverse = function (enObj, jaObj, arr) {
  const enObjData = enObj.data;
  const jaObjData = jaObj.data;
  for (const i in enObjData) {
    if (enObjData[i] !== null && typeof enObjData[i] == "object") {
      //# going one step down in the object tree!!
      const label = enObj.label !== "" ? `${enObj.label}.${i}` : `${i}`;
      const childEn = { label: label, data: enObjData[i] };
      const childNo = { label: label, data: jaObjData[i] };
      traverse(childEn, childNo, arr);
    } else {
      arr.push({
        key: enObj.label !== "" ? `${enObj.label}.${i}` : `${i}`,
        en: enObjData[i],
        ja: jaObjData[i],
      });
    }
  }
  return arr;
};

const read = async () => {
  await doc.loadInfo(); //# loads document properties and worksheets
  const sheet = doc.sheetsByTitle.Translation; //# get the sheet by title, I left the default title name. If you changed it, then you should use the name of your sheet
  const rows = await sheet.getRows({ limit: sheet.rowCount }); //# fetch rows from the sheet (limited to row count)
  //# read /public/locales/en/translation.json
  const en = fs.readFileSync(`./public/locales/en/translation.json`, {
    encoding: "utf8",
    flag: "r",
  });
  //# read /public/locales/ja/translation.json
  const ja = fs.readFileSync(`./public/locales/ja/translation.json`, {
    encoding: "utf8",
    flag: "r",
  });
  const enObj = { label: "", data: JSON.parse(en) };
  const jaObj = { label: "", data: JSON.parse(ja) };
  //# loop over JSON object and create new array
  // eslint-disable-next-line no-undef
  const result = traverse(enObj, jaObj, (arr = []));
  //# difference between google-spreadsheet rows and newly created array
  const el = result.filter(
    ({ key: id1 }) => !rows.some(({ key: id2 }) => id2 === id1)
  );
  return el;
};

const append = async (data) => {
  await doc.loadInfo(); //# loads document properties and worksheets
  const sheet = doc.sheetsByTitle.Translation; //# get the sheet by title, I left the default title name. If you changed it, then you should use the name of your sheet
  await await sheet.addRows(data); //# append rows
};

init()
  .then(() => read())
  .then((data) => append(data))
  .catch((err) => console.log("ERROR!!!!", err));
