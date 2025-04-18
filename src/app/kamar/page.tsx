"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useSession, signIn, signOut } from "next-auth/react";

// Material UI Components & Icons
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
  Alert,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { fetchRooms } from "@/utils/api";
import ReservasiButton from "@/components/ReservasiButton";
import {Menu, MenuItem} from '@mui/material';


interface Room {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface Sparkle {
  top: string;
  left: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
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
    severity: "info" as "info" | "warning" | "error" | "success",
  });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const { data: session } = useSession();

  // Dark mode based on system preference
  useEffect(() => {
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  // Generate sparkles
  useEffect(() => {
    const generateSparkles = () =>
      Array.from({ length: 5 }).map(() => ({
        top: `${Math.random() * 20 - 10}px`,
        left: `${Math.random() * 100}%`,
      }));
    setSparkles(generateSparkles());
  }, []);

  // Show/hide AppBar on scroll
  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setShowAppBar(currentY < lastScrollY || currentY === 0);
    setLastScrollY(currentY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const showSnackbar = (message: string, severity: typeof snackbar.severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", opts);
  };


  const handleSearchRooms = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (!checkIn || !checkOut) {
      showSnackbar("Silakan pilih tanggal check-in dan check-out.", "warning");
      return;
    }
    if (checkIn < today) {
      showSnackbar("Tanggal check-in tidak boleh sebelum hari ini!", "error");
      return;
    }
    if (checkOut <= checkIn) {
      showSnackbar("Tanggal check-out harus setelah check-in.", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchRooms();
      setRooms(data);
      setError(null);
 } catch {
      setError("Gagal memuat data kamar. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const open = Boolean(anchorEl);

const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
  setAnchorEl(null);
};

const handleLogout = () => {
  handleMenuClose();
  signOut();
};


  return (
    <>
      <CssBaseline />
      <div
         style={{
          background: darkMode
            ? "linear-gradient(135deg, #121212, #1a1a1a)"
            : "linear-gradient(135deg, #f8f8f8, #ffffff)",
          minHeight: "100vh",
          color: darkMode ? "#e0e0e0" : "#222",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Navbar */}
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: darkMode
              ? "rgba(34, 34, 34, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            transition: "transform 0.3s ease-in-out",
            transform: showAppBar ? "translateY(0)" : "translateY(-100%)",
            boxShadow: 3,
          }}
        >
          <Toolbar>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              color="inherit"
              sx={{ color: darkMode ? "#E0E0E0" : "#333333" }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                color: darkMode ? "#E0E0E0" : "#333333",
              }}
            >
              Hotel Hebat
            </Typography>
            <Button
  sx={{
    color: darkMode ? "#E0E0E0" : "#333333",
    transition: "all 0.3s",
    "&:hover": {
      color: "#3d74f3",
      textShadow: "0 0 10px rgba(61,116,243,0.7)",
      transform: "scale(1.05)",
    },
  }}
>
  <Link href="/">Home</Link>
</Button>

<Button
  sx={{
    color: darkMode ? "#E0E0E0" : "#333333",
    transition: "all 0.3s",
    "&:hover": {
      color: "#3d74f3",
      textShadow: "0 0 10px rgba(61,116,243,0.7)",
      transform: "scale(1.05)",
    },
  }}
>
              <Link href="/rooms">Kamar</Link>
            </Button>
            <Button
  sx={{
    color: darkMode ? "#E0E0E0" : "#333333",
    transition: "all 0.3s",
    "&:hover": {
      color: "#3d74f3",
      textShadow: "0 0 10px rgba(61,116,243,0.7)",
      transform: "scale(1.05)",
    },
  }}
>
              <Link href="/facilities">Fasilitas</Link>
            </Button>
            {session ? (
              <Box
                sx={{
                  color: darkMode ? "#E0E0E0" : "#333333",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
               <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
  <Avatar
    src={session.user.image}
    alt={session.user.name || "Profile"}
    sx={{ width: 40, height: 40 }}
  />
</IconButton>
<Menu 
  anchorEl={anchorEl}
  open={open}
  onClose={handleMenuClose}
  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  transformOrigin={{ vertical: "top", horizontal: "right" }}
  slotProps={{
    paper: {
      sx: {
        color: darkMode ? "#fff" : "#000",
        backgroundColor: darkMode ? "#333" : "#fff", // <- ini buat ubah warna background box-nya
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // opsional biar smooth
      }
    }
  }}
>
  <MenuItem sx={{
                  color: darkMode ? "#E0E0E0" : "#333333",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
  onClick={handleLogout}>Logout</MenuItem>
</Menu>

              </Box>
            ) : (
              <Button
  sx={{
    color: darkMode ? "#E0E0E0" : "#333333",
    transition: "all 0.3s",
    "&:hover": {
      color: "#3d74f3",
      textShadow: "0 0 10px rgba(61,116,243,0.7)",
      transform: "scale(1.05)",
    },
  }}
  color="inherit"
  onClick={() => signIn("google")}
>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Container
          sx={{
            pt: 10,
            pb: 6,
            textAlign: "center",
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Temukan Pengalaman Menginap Terbaik
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.7 }}>
            Kualitas dan kenyamanan hotel terbaik untuk Anda.
          </Typography>
        </Container>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 8,
          }}
        >
          {/* Lettering HOTEL HEBAT */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
              textTransform: "uppercase",
              textAlign: "center",
              letterSpacing: "4px",
              color: "#fff",
              textShadow:
                "0 0 15px rgba(61, 116, 243, 0.8), 0 0 30px rgba(93, 50, 235, 0.5)",
              position: "relative",
              animation: "shineEffect 3s infinite alternate",
              "@keyframes shineEffect": {
                "0%": {
                  textShadow:
                    "0 0 15px rgba(61, 116, 243, 0.8), 0 0 30px rgba(93, 50, 235 , 0.5)",
                },
                "100%": {
                  textShadow:
                    "0 0 25px rgba(61, 116, 243, 1), 0 0 40px rgba(93, 50, 235, 0.7)",
                },
              },
            }}
          >
            HOTEL HEBAT
          </Typography>

          {/* Garis bawah animasi */}
          <Box
            sx={{
              width: "120px",
              height: "5px",
              background:
                "linear-gradient(to right, rgba(61, 116, 243, 0.8), rgba(93, 50, 235, 0.5))",
              borderRadius: "10px",
              mt: "8px",
              animation: "underlineGlow 1.5s infinite alternate",
              "@keyframes underlineGlow": {
                "0%": { transform: "scaleX(1)", opacity: 0.7 },
                "100%": { transform: "scaleX(1.2)", opacity: 1 },
              },
            }}
          />

          {/* Partikel efek di sekitar teks - render sparkles jika sudah ada */}
          {sparkles.map((sparkle, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                width: "6px",
                height: "6px",
                background: "rgba(61, 116, 243, 0.9)",
                borderRadius: "50%",
                boxShadow: "0 0 10px rgba(93, 50, 235, 0.7)",
                animation: `sparkle${index} 2s infinite alternate`,
                top: sparkle.top,
                left: sparkle.left,
                // Definisikan keyframes jika diperlukan untuk tiap sparkle
                "@keyframes sparkle0": {
                  "0%": { transform: "translateY(-5px) scale(1)", opacity: 1 },
                  "100%": { transform: "translateY(5px) scale(1.5)", opacity: 0.5 },
                },
                "@keyframes sparkle1": {
                  "0%": { transform: "translateX(-5px) scale(1)", opacity: 1 },
                  "100%": { transform: "translateX(5px) scale(1.5)", opacity: 0.5 },
                },
              }}
            />
          ))}
        </Box>

        {/* Form Pencarian Kamar */}
        <Container
          sx={{
            pt: 10,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <TextField
                label="Tanggal Check-in"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                sx={{
                  backgroundColor: darkMode ? "#c4c4c4" : "#fff",
                  color: darkMode ? "#fff" : "#333",
                  borderRadius: "8px",
                  mb: "5px",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: darkMode ? "#E0E0E0" : "#333",
                }}
              >
                {formatDate(checkIn)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tanggal Check-out"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                sx={{
                  backgroundColor: darkMode ? "#c4c4c4" : "#fff",
                  color: darkMode ? "#fff" : "#333",
                  borderRadius: "8px",
                  mb: "5px",
                }}
              />
                 <Typography
                variant="body2"
                sx={{
                  color: darkMode ? "#E0E0E0" : "#333",
                }}
              >
                {formatDate(checkOut)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSearchRooms}
                sx={{
                  "&:hover": {
                    backgroundColor: darkMode ? "#3f51b5" : "#1976d2",
                  },
                }}
              >
                Cari Kamar
              </Button>
            </Grid>
          </Grid>
        </Container>

        {/* Loader & Error Handling */}
        {loading && (
          <CircularProgress sx={{ display: "block", mt: 3, mx: "auto" }} />
        )}
        {error && <Typography color="error">{error}</Typography>}

        {/* Daftar Kamar */}
        <Container sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {rooms.map((room) => (
              <Grid item xs={12} sm={6} md={4 } key={room.id}>
                <Card
                  sx={{
                    backgroundColor: darkMode ? "#1e1e1e" : "#fff",
                    color: darkMode ? "#e0e0e0" : "#000",
                    boxShadow: 3,
                    borderRadius: 2,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={room.imageUrl || "/default-room.jpg"}
                    alt={room.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {room.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {room.description}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Harga: Rp {room.price.toLocaleString("id-ID")}
                    </Typography>

                    {/* Tombol Reservasi */}
                    {session ? (
  <ReservasiButton
    roomId={room.id}
    checkIn={checkIn}
    checkOut={checkOut}
  />
) : (
  <Typography color="error" sx={{ mt: 1 }}>
    Login terlebih dahulu untuk melakukan reservasi.
  </Typography>
)}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity as any} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}