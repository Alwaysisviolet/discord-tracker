import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Lấy webhook từ biến môi trường Render
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Route test đơn giản (GET /)
app.get("/", (req, res) => {
  res.send("✅ Server đang chạy ngon rồi!");
});

// Route nhận tracking từ web (POST /track)
app.post("/track", async (req, res) => {
  console.log("📩 Có request tới /track:", req.body); // Log dữ liệu từ web

  const { ip, userAgent } = req.body;

  // Tạo nội dung gửi vào Discord
  const message = {
    content: `🔔 Có người vừa vào web!\n🌍 IP: ${ip}\n🖥️ Trình duyệt: ${userAgent}\n⏰ Thời gian: ${new Date().toLocaleString("vi-VN")}`
  };

  try {
    // Gửi tới Discord Webhook
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    console.log("📤 Gửi tới Discord, status:", response.status);

    if (response.ok) {
      res.json({ success: true });
    } else {
      const errText = await response.text();
      console.error("❌ Discord trả về lỗi:", errText);
      res.status(500).json({ success: false, error: errText });
    }
  } catch (err) {
    console.error("❌ Lỗi khi gửi Discord:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server chạy ở cổng 3000");
});
