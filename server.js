import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK_URL = "WEBHOOK_DISCORD_CỦA_BẠN"; // đổi thành webhook bạn vừa tạo

app.post("/track", async (req, res) => {
  const { ip, userAgent } = req.body;

  const message = {
    content: `🔔 Có người vừa vào web!\n🌍 IP: ${ip}\n🖥️ Trình duyệt: ${userAgent}`
  };

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.listen(3000, () => console.log("✅ Server chạy ở cổng 3000"));
