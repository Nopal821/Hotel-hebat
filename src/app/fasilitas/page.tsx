// "use client";

// import { useEffect, useState } from "react";
// import Navbar from "@/components/Navbar";
// import { fetchFacilities } from "@/utils/api";
// import { Container, Typography, Card, CardContent } from "@mui/material";

// interface Facility {
//   id: number;
//   name: string;
//   description: string;
// }

// export default function Facilities() {
//   const [facilities, setFacilities] = useState<Facility[]>([]);

//   useEffect(() => {
//     fetchFacilities().then((data) => setFacilities(data));
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <Container>
//         <Typography variant="h4" gutterBottom>
//           Fasilitas Kami
//         </Typography>
//         {facilities.map((facility) => (
//           <Card key={facility.id} sx={{ marginBottom: 2 }}>
//             <CardContent>
//               <Typography variant="h6">{facility.name}</Typography>
//               <Typography variant="body1">{facility.description}</Typography>
//             </CardContent>
//           </Card>
//         ))}
//       </Container>
//     </>
//   );
// }
