// server.js
import express from "express";
import multer from "multer";
import cors from "cors";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import fs from "node:fs";

const app = express();
app.use(cors());

// --- config (adjust paths if different) ---
const WHISPER_BIN   = "C:\\Users\\user\\whisper.cpp\\build\\bin\\whisper-cli.exe";
const WHISPER_MODEL = "C:\\Users\\user\\whisper.cpp\\models\\ggml-medium.bin";
const MINGW_BIN     = "C:\\msys64\\mingw64\\bin"; // contains libstdc++-6.dll, etc.
const BASE_ARGS     = ["-otxt", "-t", "4"];       // add "-l","ceb" to force Cebuano

// ensure uploads dir exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// always save as .wav so whisper picks the decoder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}.wav`)
});
const upload = multer({ storage });

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  const wavPath = path.resolve(req.file.path);
  const args    = ["-m", WHISPER_MODEL, "-f", wavPath, ...BASE_ARGS];
  const env     = { ...process.env, PATH: process.env.PATH + ";" + MINGW_BIN };

  // respond only once
  let replied = false;
  const reply = (status, body) => {
    if (replied) return;
    replied = true;
    res.status(status).send(body);
  };

  try {
    execFile(WHISPER_BIN, args, { env }, async (err, stdout, stderr) => {
      if (err) {
        console.error("whisper error:", err, "\nSTDERR:", stderr);
        return reply(500, stderr || err.message || "whisper failed");
      }
      try {
        const txt = await readFile(wavPath + ".txt", "utf8");
        reply(200, txt.trim());
      } catch (readErr) {
        console.error("read error:", readErr);
        reply(500, "Failed to read whisper output.");
      }
    });
  } catch (e) {
    console.error("server error:", e);
    reply(500, "Server error.");
  }
});

app.listen(8080, () => console.log("✅ Whisper server running on port 8080"));
