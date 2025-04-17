"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
} from "@mui/material";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface ReservasiButtonProps {
    roomId: number;
    checkIn: string;
    checkOut: string;
  }
  
  export default function ReservasiButton({
    roomId,
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
  }: ReservasiButtonProps) {
    const [open, setOpen] = useState(false);
    const [checkIn, setCheckIn] = useState(initialCheckIn);
    const [checkOut, setCheckOut] = useState(initialCheckOut);  
    const [jumlahTamu, setJumlahTamu] = useState(1);
    const [catatan, setCatatan] = useState("");


    const checkLogin = () => {
        const token = Cookies.get("token"); // atau nama cookie sesuai dengan autentikasi kamu
        if (!token) {
          alert("Anda harus login untuk mengakses halaman ini.");
          return false;
        }
        return true;
      };

  const handleOpen = () => {
    setCheckIn(initialCheckIn); // isi ulang dari props
    setCheckOut(initialCheckOut);
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false);

  const handleReservasi = async () => {
    const csrfToken = Cookies.get("XSRF-TOKEN") || "";

    try {
      const response = await fetch("http://localhost:8000/api/reservasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
          user_id: 1, // nanti ganti pakai session.user.id
          room_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
          jumlah_tamu: jumlahTamu,
          status: "pending",
          catatan,
        }),
      });
      if (response.ok) {
        alert("Reservasi berhasil!");
        handleClose();
      } else {
        alert("Reservasi gagal. Coba lagi.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saat mengirim reservasi.");
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleOpen}
      >
        Reservasi Sekarang
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            Formulir Reservasi
          </Typography>
          <TextField
            label="Check-in"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <TextField
            label="Check-out"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
          <TextField
            label="Jumlah Tamu"
            type="number"
            fullWidth
            margin="normal"
            value={jumlahTamu}
            onChange={(e) => setJumlahTamu(Number(e.target.value))}
          />
          <TextField
            label="Catatan"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleReservasi}
            fullWidth
            sx={{ mt: 2 }}
          >
            Kirim Reservasi
          </Button>
        </Box>
      </Modal>
    </>
  );
}
