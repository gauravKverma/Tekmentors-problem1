const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

app.use(express.json());
app.use(cors());

app.get("/invoice", (req,res) => {
  fs.readFile('../src/invoice.csv', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(data);
  });
})

app.post("/calculateTax", (req, res) => {
  let string = req.body.fileData;
  const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
  csvHeader.push("Tax");
  const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

  let info = csvRows.map((el) => {
    const values = el.split(",");
    const obj = csvHeader.reduce((object, header, index) => {
      if (header === "Tax") {
        if (object["Item_type"] === "0") {
          object[header] = (Number(object["Amount"]) * 0.05)
            .toFixed(1)
            .toString();
        }
        if (object["Item_type"] === "1") {
          object[header] = (Number(object["Amount"]) * 0.08)
            .toFixed(1)
            .toString();
        }
        if (object["Item_type"] === "2") {
          object[header] = (Number(object["Amount"]) * 0.12)
            .toFixed(1)
            .toString();
        }
      } else {
        object[header] = values[index];
      }
      return object;
    }, {});
    return obj;
  });

  let resultData = info.map((el) => {
    return Object.values(el);
  });
  resultData.unshift(csvHeader);
  let csv = resultData
    .map(function (d) {
      return d.join();
    })
    .join("\n");
  if (fs.existsSync("../src/result.csv")) {
    fs.unlink("../src/result.csv", function (err) {
      if (err) throw err;
    });
  }
  fs.appendFile("../src/result.csv", csv, "utf8", function (err) {
    if (err) throw err;
    fs.readFile('../src/result.csv', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      res.send({data:data,message:"file saved"});
    });
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("server started");
});
