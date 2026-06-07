import dotenv from "dotenv";
import connectDB from "./db/index.js";
import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import "./bots/telegramBot.js";
import aviatorSocketHandler from "./sockets/aviator.socket.js";
import { initializeGameTimer } from "./controllers/colorGame.controller.js";
import { initializeColorGameTimer } from "./controllers/aviatorGame.controller.js";
import { createInterface } from "readline";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
dotenv.config({
  path: "./.env",
});


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Update with frontend URL in production
    methods: ["GET", "POST"],
  },
});

const apiId = 23416733;
const apiHash = "e87f3e11b9917aa1cb3c0cd4f9a3c63c";
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
  retryDelay: 1000,
});

client.setLogLevel("debug");
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (query) =>
  new Promise((resolve) =>
    rl.question(query, (answer) => resolve(answer.trim()))
  );

(async () => {
  console.log(
    "🔍 TELEGRAM_SESSION:",
    process.env.TELEGRAM_SESSION || "Not set"
  );
  console.log("🔌 Connecting to Telegram...");

  if (!process.env.TELEGRAM_SESSION) {
    try {
      await client.start({
        phoneNumber: async () => {
          const phone = "+918769303560";
          if (!phone.match(/^\+\d{10,12}$/)) {
            console.log("❌ Invalid phone number format. Use +91XXXXXXXXXX");
            process.exit(1);
          }
          console.log("📞 Provided phone number:", phone);
          return phone;
        },
        phoneCode: async () => {
          const code = await prompt("📩 Enter the code you received: ");
          console.log("📩 Provided code:", code);
          return code;
        },
        password: async () => {
          const pwd = await prompt("🔑 Enter 2FA password (if any): ");
          console.log("🔑 Provided password:", pwd);
          return pwd;
        },

        onError: (err) => {
          console.error("❌ Telegram Error:", err.message);
          throw err;
        },
      });

      console.log("✅ Connected!");
      console.log("👉 Copy this and paste into your .env file:");
      console.log("TELEGRAM_SESSION=" + client.session.save());
    } catch (e) {
      console.error("❌ Telegram Connection Failed:", e.message);
      rl.close();
      process.exit(1);
    }
  } else {
    try {
      await client.connect();
      console.log("✅ Reconnected with saved session!");
    } catch (e) {
      console.error("❌ Telegram Reconnection Failed:", e.message);
      rl.close();
      process.exit(1);
    }
  }

  // Database + Server
})();

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  //aviatorSocketHandler(io, socket); // <-- Handle Aviator game socket logic here

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

app.get("/my-channels", async (req, res) => {
  try {
    const dialogs = await client.getDialogs();
    const channels = dialogs
      .filter((d) => d.isChannel)
      .map((c) => ({
        id: c.id.toString(),
        title: c.title,
        username: c.username || null,
        isMegagroup: c.isMegagroup,
        isBroadcast: c.isBroadcast,
      }));
    res.json({ success: true, channels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

connectDB()
  .then(() => {
    initializeGameTimer(io);
    initializeColorGameTimer(io);
    server.on("error", (error) => {
      console.log("❌ Server Error : ", error);
      throw error;
    });
    server.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed !! ", error);
  });
