import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";

const TaxCalculator = () => {
  const [header, setHeader] = useState([]);
  const [fileData, setFileData] = useState("");
  const [data, setData] = useState([]);

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    setHeader(csvHeader);
    let info = csvRows.map((el) => {
      const values = el.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });
    setData(info);
  };

  const calculateTax = async () => {
    let res = await axios.post("https://tekmentors-problem1.onrender.com/calculateTax", {
      fileData: fileData,
    });
    if (res.data.message === "file saved") {
      alert("result.csv file with tax value saved in src folder");
    }
    csvFileToArray(res.data.data);
  };

  useEffect(() => {
    const getInvoiceData = async () => {
      let res = await axios.get("https://tekmentors-problem1.onrender.com/invoice");
      setFileData(res.data);
      csvFileToArray(res.data);
    };
    getInvoiceData();
  }, []);

  return (
    <div>
      <h1>TAL CALCULATOR</h1>
      <button onClick={calculateTax}>Calculate Tax</button>
      <br />
      <br />
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {header.map((el) => (
              <th style={{ padding: "5px 15px" }} key={el}>
                {el}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {data.map((item) => (
            <tr key={item.Amount}>
              {Object.values(item).map((val) => (
                <td style={{ padding: "3px 15px" }} key={val}>
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaxCalculator;
