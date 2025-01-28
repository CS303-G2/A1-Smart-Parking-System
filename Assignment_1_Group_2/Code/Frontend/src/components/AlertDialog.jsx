import * as React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify"; // Import toast for success message
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import api from "../api";

export default function AlertDialog({ slot, query }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); // Initialize navigation

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    setOpen(false); // Close the dialog
    const token = localStorage.getItem("jwt_token");

    try {
      // Make the API call inside try block
      await api.post(
        "/lotBook",
        { lot_id: query },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // If successful, show success toast and redirect
      toast.success(`Booking confirmed for ${slot}`, {
        position: "top-center",
      });
      setTimeout(() => {
        navigate("/bookings");
      }, 1500);
    } catch (error) {
      // Handle any errors during the API call
      console.error("Error booking slot:", error);
      toast.error("Failed to book the slot. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <React.Fragment>
      <div
        onClick={handleClickOpen}
        className={`w-10 h-10 border ${
          slot ? "bg-green-100 hover:bg-green-200" : "bg-gray-200"
        } rounded-lg shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 transition`}
      ></div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Your Booking"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to book the slot <strong>{slot}</strong>? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
