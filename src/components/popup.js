import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import styles from "@/styles/Pos.module.css";
// import { LINKS } from "../constants/links";

import {
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
} from "@mui/material";

export default function AlertDialog({
  generateURI,
  uri,
  address,
  amountInAda,
  amountInDollars,
  clearFields,
}) {
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState("");
  const [newBalance, setNewBalance] = useState("");

  // Handle opening popup
  const handleClickOpen = () => {
    setOpen(true);
    generateURI();
  };

  // Clear balance when closing popup
  const clearBalance = () => {
    setBalance("");
    setNewBalance("");
  };

  // Close popup
  const handleClose = () => {
    setOpen(false);
    clearFields();
    clearBalance();
  };

  return (
    <div className={styles.popup}>
      <Button
        disabled={address && amountInAda ? false : true}
        variant="outlined"
        onClick={handleClickOpen}
        className={
          address && amountInAda ? styles.qrButton : styles.dissabledQrButton
        }
      >
        Generate QR code
      </Button>
      <Dialog open={open} onClose={handleClose} style={{ padding: 20 }}>
        <DialogContentText className={styles.dialogueHeader}>
          Order total:
        </DialogContentText>
        <DialogContentText className={styles.marginAuto}>
          {`${amountInAda} ₳ = ${amountInDollars}$`}
        </DialogContentText>
        <DialogContentText className={styles.dialogueHeader}>
          Send:
        </DialogContentText>
        <DialogContentText className={styles.marginAuto}>
          {`${amountInAda} ₳`}
        </DialogContentText>
        <DialogContentText className={styles.dialogueHeader}>
          To Address:
        </DialogContentText>
        <DialogContentText className={styles.addressHref}>
          <a
            className={styles.href}
            // href={LINKS.CARDANO_SCAN + address}
            target="_blank"
          >
            {address.substring(0, 30) + "..."}
          </a>
        </DialogContentText>
        <DialogContent>
          <div className={styles.qrCode}>
            <QRCode value={uri} />
          </div>
          {newBalance - balance >= amountInAda ? (
            <DialogContentText className={styles.approvedConfirmation}>
              Payment received successfully
            </DialogContentText>
          ) : (
            <DialogContentText className={styles.waitingConfirmation}>
              Waiting for payment...
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            autoFocus
            className={styles.completeButton}
          >
            Complete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
