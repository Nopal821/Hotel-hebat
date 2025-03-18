"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchRooms } from "@/utils/api";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  CssBaseline,
  IconButton,
} from "@mui/material";
import { Brightness4, Brightness7, Menu as MenuIcon } from "@mui/icons-material";

// Navbar navigasi utama
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

interface Room {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [showAppBar, setShowAppBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowAppBar(window.scrollY < lastScrollY || window.scrollY === 0);
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearchRooms = () => {
    const today = new Date().toISOString().split("T")[0];

    if (!checkIn || !checkOut) {
      setSnackbar({ open: true, message: "Silakan pilih tanggal check-in dan check-out.", severity: "warning" });
      return;
    }

    if (checkIn < today) {
      setSnackbar({ open: true, message: "Tanggal check-in tidak boleh sebelum hari ini!", severity: "error" });
      return;
    }

    if (checkOut <= checkIn) {
      setSnackbar({ open: true, message: "Tanggal check-out harus setelah check-in.", severity: "error" });
      return;
    }

    setLoading(true);
    fetchRooms()
      .then((data) => {
        setRooms(data);
        setFilteredRooms(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data kamar. Coba lagi nanti.");
        setLoading(false);
      });
  };

  return (
    <>
      <CssBaseline />
      <div
        style={{
          backgroundColor: darkMode ? "#181818" : "#f0f0f0",
          minHeight: "100vh",
          color: darkMode ? "#e0e0e0" : "#222",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        {/* Navbar Navigasi Utama */}
        <Navbar />

        {/* AppBar untuk Mode Malam/Siang */}
        <AppBar
          position="fixed"
          sx={{
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#000",
            boxShadow: 3,
            transition: "transform 0.3s ease-in-out",
            transform: showAppBar ? "translateY(0)" : "translateY(-100%)",
            zIndex: 1201, // Supaya tidak menutupi Navbar Navigasi
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Hotel Hebat
            </Typography>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 12 }}>
          <Typography variant="h4" textAlign="center" fontWeight="bold">
            Temukan Pengalaman Menginap Terbaik
          </Typography>

          <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Grid item xs={6}>
              <TextField
                label="Check-in"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Check-out"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSearchRooms}>
                Cari Kamar
              </Button>
            </Grid>
          </Grid>

          {loading && <CircularProgress sx={{ display: "block", mt: 3, mx: "auto" }} />}
          {error && <Typography color="error">{error}</Typography>}

          {checkIn && checkOut && (
            <>
              {filteredRooms.length === 0 && !loading && (
                <Typography sx={{ mt: 3 }}>Tidak ada kamar tersedia.</Typography>
              )}
              <Grid container spacing={3} sx={{ mt: 3 }}>
                {filteredRooms.map((room) => (
                  <Grid item xs={12} sm={6} md={4} key={room.id}>
                    <Card sx={{ backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#e0e0e0" : "#000" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={room.imageUrl || "/default-room.jpg"}
                        alt={room.name}
                      />
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold">
                          {room.name}
                        </Typography>
                        <Typography variant="body2">{room.description}</Typography>
                        <Typography variant="body1" color="primary">
                          Harga: Rp {room.price.toLocaleString()}
                        </Typography>
                        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                          Reservasi Sekarang
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Container>

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as any} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}
