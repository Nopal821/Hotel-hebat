import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        top: showNavbar ? 0 : "-80px",
        transition: "top 0.3s ease-in-out",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        color: "black",
        boxShadow: showNavbar ? 3 : 0,
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Hotel Hebat
        </Typography>
        <Button color="inherit">
          <Link href="/">Home</Link>
        </Button>
        <Button color="inherit">
          <Link href="/rooms">Kamar</Link>
        </Button>
        <Button color="inherit">
          <Link href="/facilities">Fasilitas</Link>
        </Button>
        {session ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={session.user.image}
              alt="Profile"
              sx={{ width: 40, height: 40 }}
            />
            <Button color="inherit" onClick={() => signOut()}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => signIn("google")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
