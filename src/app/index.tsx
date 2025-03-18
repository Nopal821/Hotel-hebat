import Navbar from "@/components/Navbar";
import { Container, Typography } from "@mui/material";

export default function Home() {
  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Selamat Datang di Hotel Hebat
        </Typography>
        <Typography variant="body1">
          Nikmati pengalaman menginap terbaik dengan fasilitas premium.
        </Typography>
      </Container>
    </>
  );
}
