import React, { useState, useEffect } from "react";
import Image from "next/image";
import Popup from "../components/popup.js";
import styles from "@/styles/Pos.module.css";
import TextField from "@mui/material/TextField";

export default function pos() {
  const [uri, setUri] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [adaValue, setAdaValue] = useState("");

  // Insert new number into number input
  const insertNumber = (num) => {
    setAmount((prevNumber) => prevNumber * 10 + num);
  };

  // Remove last number from number input
  const removeLastDigit = () => {
    setAmount((prevNumber) => Math.floor(prevNumber / 10));
  };

  // Generate URI for QR code
  const generateURI = () => {
    setUri(`cardano:${address}?amount=${(amount / adaValue).toFixed(2)}`);
  };

  // Clear inputs when closing popup
  const clearFields = () => {
    setAmount("");
    setAddress("");
  };

  return (
    <div className={styles.index}>
      <div>
        <div className={styles.logo}>
          <Image src="/cardano-logo.png" alt="Logo" width={42} height={40} />
        </div>
        <div className={styles.header}>ADA PAYMENT</div>
        <TextField
          type="number"
          variant="outlined"
          id="outlined-basic"
          label="Insert Amount"
          value={amount}
          className={styles.amountInput}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        {amount >= 1 ? (
          <div className={styles.adaValue}>
            {amount} $ = {(amount / adaValue).toFixed(2)} ₳
          </div>
        ) : (
          <div className={styles.adaValue}>
            1 $ = {parseFloat(1 / adaValue).toFixed(2)} ₳
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
        type="text"
        variant="outlined"
        id="outlined-basic"
        label="Insert Address"
        value={address}
        className={styles.addressInput}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Popup
        uri={uri}
        amountInAda={(amount / adaValue).toFixed(2)}
        amountInDollars={amount}
        address={address}
        adaValue={adaValue}
        className={styles.popup}
        generateURI={generateURI}
        clearFields={clearFields}
      />
    </div>
  );
}
