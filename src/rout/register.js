async function getDataUp() {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showToast("email sama password isi dulu dong", "info");
    return;
  }

  if (password.length < 6) {
    showToast("password minimal 6 digit", "info");
    return;
  }

  try {
    const response = await fetch(
      "https://login-register02-production-85a9.up.railway.app/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("uid", data.user.uid);
      localStorage.setItem("email", data.user.email);
      showToast(
        "Register berhasil! Selamat datang " + data.user.email,
        "success",
      );
      // window.location.href = "dashboard.html";
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    showToast("server error boss", "error");
  }
}

// notif
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");

  // Konfigurasi warna berdasarkan tipe
  const config = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-500",
      text: "text-emerald-800",
      icon: "✅",
    },
    error: {
      bg: "bg-rose-50",
      border: "border-rose-500",
      text: "text-rose-800",
      icon: "❌",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-500",
      text: "text-blue-800",
      icon: "ℹ️",
    },
  };

  const style = config[type] || config.info;

  // Buat element toast
  const toast = document.createElement("div");

  // Class Tailwind untuk styling & animasi awal (opacity 0 & geser ke kanan)
  toast.className = `flex items-center p-4 rounded-xl border-l-4 shadow-lg transition-all duration-500 ease-out opacity-0 translate-x-10 ${style.bg} ${style.border} ${style.text}`;

  toast.innerHTML = `
    <span class="mr-3 text-lg">${style.icon}</span>
    <p class="text-sm font-medium leading-relaxed">${message}</p>
  `;

  container.appendChild(toast);

  // Trigger animasi masuk (sedikit delay biar transition jalan)
  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-x-10");
    toast.classList.add("opacity-100", "translate-x-0");
  }, 10);

  // Hapus otomatis setelah 3.5 detik
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-x-0");
    toast.classList.add("opacity-0", "translate-x-10");

    // Hapus dari DOM setelah animasi keluar selesai
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}
