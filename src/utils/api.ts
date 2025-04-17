export const fetchRooms = async (userId?: string) => {
  try {
    // Gunakan endpoint lokal, tambahkan query jika userId tersedia
    const endpoint = userId
      ? `http://127.0.0.1:8000/api/rooms?userId=${userId}`
      : `http://127.0.0.1:8000/api/rooms`;

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error("Gagal mengambil data kamar.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};
