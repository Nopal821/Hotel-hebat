"use client";


import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';

interface ReservasiFormProps {
  userId: number;
  roomId: number;
}




const ReservasiForm: React.FC<ReservasiFormProps> = ({ userId, roomId }) => {
  const { data: session } = useSession();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [jumlahTamu, setJumlahTamu] = useState('');
  const [catatan, setCatatan] = useState('');


  useEffect(() => {
    if (!session) {
      alert("Anda harus login untuk mengakses halaman ini.");
    }
  }, [session]);

  const handleSubmit = async () => {
    if (!session) {
      alert("Anda belum login.");
      return;
    }
  
    const csrfToken = Cookies.get('XSRF-TOKEN');
  
    try {
      const response = await fetch('http://localhost:8000/api/reservasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken ?? '',
          'Authorization': `Bearer ${session.accessToken}`, // <-- penting
        },
        body: JSON.stringify({
          user_id: userId,
          room_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
          jumlah_tamu: jumlahTamu,
          status: 'pending',
          catatan: catatan,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Reservasi berhasil!');
      } else {
        alert(`Gagal: ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat mengirim data');
    }
  };
  
  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" mb={2}>Form Reservasi</Typography>
      <TextField
        label="Check-in"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Check-out"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Jumlah Tamu"
        type="number"
        fullWidth
        value={jumlahTamu}
        onChange={(e) => setJumlahTamu(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Catatan"
        multiline
        fullWidth
        value={catatan}
        onChange={(e) => setCatatan(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Submit Reservasi
      </Button>
    </Box>
  );
};

export default ReservasiForm;
