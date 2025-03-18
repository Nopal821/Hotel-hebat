export async function fetchRooms() {
    try {
      const response = await fetch("http://127.0.0.1:8000/rooms"); // Pastikan API berjalan
      if (!response.ok) {
        throw new Error("Gagal mengambil data kamar.");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  }
  