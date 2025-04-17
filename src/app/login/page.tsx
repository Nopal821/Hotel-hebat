"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Container, TextField, Typography, Box, CircularProgress } from "@mui/material";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  if (status === "authenticated") {
    router.push("/kamar"); // Redirect jika sudah login
    return <CircularProgress />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    await signIn("credentials", { ...formData, redirect: false });
    setLoading(false);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button variant="contained" fullWidth onClick={handleLogin} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Login with Email"}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => signIn("google")}
        >
          Login with Google
        </Button>
      </Box>
    </Container>
  );
}
