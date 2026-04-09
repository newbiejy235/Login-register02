const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 4003;
const middleWare = require("./middleware/cors");
const path = require("path");

const {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} = require("./fireBase/fireBase");

const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use(middleWare);
app.use(express.json());



app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/recovery", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.endsWith("@gmail.com")) {
    return res
      .status(400)
      .json({ message: "Email harus menggunakan @gmail.com" });
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return res
      .status(200)
      .json({ message: "Link reset password sudah dikirim ke email kamu" });
  } catch (error) {
    let message = "Gagal mengirim email";
    if (error.code === "auth/user-not-found") message = "Email tidak terdaftar";
    if (error.code === "auth/invalid-email")
      message = "Format email tidak valid";

    return res.status(400).json({ message, errorCode: error.code });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validasi input dulu
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Ambil token buat dikirim ke client
    const token = await user.getIdToken();

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        uid: user.uid,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle error dari Firebase
    let message = "Login gagal";

    if (error.code === "auth/user-not-found") message = "User tidak ditemukan";
    else if (error.code === "auth/wrong-password") message = "Password salah";
    else if (error.code === "auth/invalid-email")
      message = "Format email tidak valid";
    else if (error.code === "auth/too-many-requests")
      message = "Terlalu banyak percobaan, coba lagi nanti";

    return res.status(401).json({ message, errorCode: error.code });
  }
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  // Validasi panjang password
  if (password.length < 6) {
    return res.status(400).json({ message: "Password minimal 6 karakter" });
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    const token = await user.getIdToken();

    return res.status(201).json({
      message: "Register berhasil",
      token,
      user: {
        uid: user.uid,
        email: user.email,
      },
    });
  } catch (error) {
    let message = "Register gagal";

    if (error.code === "auth/email-already-in-use")
      message = "Email sudah terdaftar";
    else if (error.code === "auth/invalid-email")
      message = "Format email tidak valid";
    else if (error.code === "auth/weak-password")
      message = "Password terlalu lemah";

    return res.status(400).json({ message, errorCode: error.code });
  }
});

app.listen(PORT, () => {
  console.log(`WEB BERJALAN PADA PORT`, PORT);
});
