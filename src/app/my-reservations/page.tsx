"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import Link from "next/link";

interface Reservation {
  id: number;
  check_in: string;
  check_out: string;
  jumlah_tamu: number;
  status: string;
  catatan: string | null;
  room: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string | null;
  } | null;
}

export default function MyReservationsPage() {
  const { data: session, status } = useSession();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "error" | "success" | "info" | "warning"; }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [darkMode, setDarkMode] = useState(true);
  const [showAppBar, setShowAppBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // show/hide AppBar on scroll
  useEffect(() => {
    const onScroll = () => {
      setShowAppBar(window.scrollY < lastScrollY || window.scrollY === 0);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) {
      setLoading(false);
      return;
    }
  
    fetch(`http://localhost:8000/api/pemesanan/user/${session.user.id}`, {
      // no need Authorization header kalau route publik
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        setReservations(Array.isArray(json.data) ? json.data : []);
      })
      .catch(err => {
        console.error(err);
        setSnackbar({ open: true, message: 'Gagal memuat reservasi.', severity: 'error' });
      })
      .finally(() => setLoading(false));
  }, [session, status]);
  

  // jika belum login
  if (status === "loading") {
    return (
      <>
        <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} showAppBar={showAppBar} />
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </>
    );
  }
  if (status !== "authenticated") {
    return (
      <>
        <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} showAppBar={showAppBar} />
        <Container sx={{ mt: 10, textAlign: "center" }}>
          <Typography variant="h6">Silakan login untuk melihat reservasi Anda.</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} showAppBar={showAppBar} />

      <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Reservasi Saya
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : reservations.length === 0 ? (
          <Typography>Tidak ada reservasi ditemukan.</Typography>
        ) : (
          reservations.map((resv) => (
            <Card key={resv.id} sx={{ mb: 3 }}>
              <CardContent>
                {resv.room ? (
                  <>
                    <Typography variant="h6">{resv.room.name}</Typography>
                    <Typography>
                      Check‑in: {new Date(resv.check_in).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      Check‑out: {new Date(resv.check_out).toLocaleDateString()}
                    </Typography>
                    <Typography>Jumlah Tamu: {resv.jumlah_tamu}</Typography>
                    <Typography>Status: {resv.status}</Typography>
                    <Typography>
                      Harga: Rp {resv.room.price.toLocaleString("id-ID")}
                    </Typography>
                    {resv.catatan && <Typography>Catatan: {resv.catatan}</Typography>}
                  </>
                ) : (
                  <Typography color="error">Data kamar tidak tersedia.</Typography>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
