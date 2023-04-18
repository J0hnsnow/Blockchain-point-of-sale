import React, { useState, useEffect } from "react";
import Popup from "../components/popup.js";
import styles from "@/styles/Pos.module.css";
import TextField from "@mui/material/TextField";
import Image from "next/image";

export default function pos() {
  const [uri, setUri] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [adaValue, setAdaValue] = useState("");

  const insertNumber = (num) => {
    setAmount((prevNumber) => prevNumber * 10 + num);
  };

  const removeLastDigit = () => {
    setAmount((prevNumber) => Math.floor(prevNumber / 10));
  };

  const generateURI = () => {
    setUri(`cardano:${address}?amount=${amount}`);
  };

  const clearFields = () => {
    setAmount("");
    setAddress("");
  };

  const fetchAdaPrice = async () => {
    fetch("/api/coinmarketcap")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setAdaValue(data.value))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    const fetchPrice = async () => {
      await fetchAdaPrice();
    };
    fetchPrice();
  }, []);

  return (
    <div className={styles.center}>
      <div>
        <div
          style={{
            margin: "auto",
            display: "block",
            textAlign: "center",
            paddingBottom: 10,
          }}
        >
          <Image src="/cardano-logo.png" alt="Logo" width={42} height={40} />
        </div>
        <div className={styles.header}>ADA PAYMENT</div>
        <TextField
          id="outlined-basic"
          label="Insert Amount"
          variant="outlined"
          className={styles.amountInput}
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        {amount >= 1 ? (
          <div className={styles.adaValue}>
            {amount} ₳ = {(adaValue * amount).toFixed(2)} $
          </div>
        ) : (
          <div className={styles.adaValue}>
            1 ₳ = {parseFloat(adaValue).toFixed(2)} $
          </div>
        )}
        <div className={styles.buttons}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "00", 0].map((num) => (
            <button key={num} onClick={() => insertNumber(num)}>
              {num}
            </button>
          ))}
          <button onClick={removeLastDigit}>←</button>
        </div>
      </div>
      <TextField
        id="outlined-basic"
        label="Insert Address"
        variant="outlined"
        className={styles.addressInput}
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Popup
        className={styles.popup}
        adaValue={adaValue}
        uri={uri}
        generateURI={generateURI}
        clearFields={clearFields}
        address={address}
        amount={amount}
      />
    </div>
  );
}
