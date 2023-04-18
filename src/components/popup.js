import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import QRCode from "qrcode.react";
import styles from "@/styles/Pos.module.css";
import { LINKS } from "../constants/links";


export default function AlertDialog({
  generateURI,
  uri,
  address,
  amount,
  clearFields,
  adaValue,
}) {
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState("");
  const [newBalance, setNewBalance] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
    generateURI();
  };

  const clearBalance = () => {
    setBalance("");
    setNewBalance("");
  };

  const handleClose = () => {
    setOpen(false);
    clearFields();
    clearBalance();
  };

  const fetchAddressQuantityOnOpen = async () => {
    address.length &&
      fetch(`/api/blockfrost?address=${address}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.value.received_sum) {
            setBalance(data.value.received_sum[0].quantity / 1000000);
          }
        })
        .catch((error) => console.error("Error:", error));
  };

  const CompareQuantity = async () => {
    fetch(`/api/blockfrost?address=${address}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.value.received_sum) {
          setNewBalance(data.value.received_sum[0].quantity / 1000000);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    address && fetchAddressQuantityOnOpen(address);
    const interval =
      address &&
      setInterval(() => {
        const result = CompareQuantity(address);
        return result;
      }, 3000);
    return () => clearInterval(interval);
  }, [address]);

  return (
    <div className={styles.popup}>
      <Button
        disabled={address && amount ? false : true}
        variant="outlined"
        onClick={handleClickOpen}
        className={address && amount ? styles.qrButton : styles.dissabledQrButton}
      >
        Generate QR code
      </Button>
      <Dialog open={open} onClose={handleClose} style={{padding: 20}}>
        <DialogContentText style={{ margin: "auto", fontWeight: 600, marginTop: 20, color: 'rgb(10, 56, 166)' }}>
          Order total:
        </DialogContentText>
        <DialogContentText style={{ margin: "auto" }}>
          {`${amount} ₳ = ${(amount * adaValue).toFixed(2)} $`}
        </DialogContentText>
        <DialogContentText style={{ margin: "auto", fontWeight: 600, color: 'rgb(10, 56, 166)' }}>Send:</DialogContentText>
        <DialogContentText style={{ margin: "auto"}}>
          {`${amount} ₳`}
        </DialogContentText>
        <DialogContentText style={{ margin: "auto", fontWeight: 600, color: 'rgb(10, 56, 166)'}}>
          To Address:
        </DialogContentText>
        <DialogContentText style={{ margin: "auto", padding: '0px 20px'}}>
          <a className={styles.href} href={LINKS.CARDANO_SCAN + address} target="_blank">
            {address.substring(0, 30) + "..."}
          </a>
        </DialogContentText>
        <DialogContent>
          <div className={styles.qrCode}>
            <QRCode value={uri} />
          </div>
          {newBalance - balance >= amount ? (
            <DialogContentText
              className={styles.approvedConfirmation}
            >
              Payment received successfully
            </DialogContentText>
          ) : (
            <DialogContentText
              className={styles.waitingConfirmation}
            >
              Waiting for payment...
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus style={{color: 'rgb(0, 51, 173)'}}>
            Complete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
