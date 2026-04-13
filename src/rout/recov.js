async function sendReset() {
  const email = document.getElementById("recovEmail").value.trim();
  const errorEl = document.getElementById("emailError");
  const btn = document.getElementById("btnSend");
  errorEl.classList.add("hidden");

  if (!email) {
    showToast("Email wajib di isi", "info");
    return;
  }

  if (!email.endsWith("@gmail.com")) {
    showToast("Harus pake Email @gmail.com", "info");
    return;
  }

  btn.textContent = "Mengirim...";
  showToast("Mengirim email 👍", "success");
  btn.disabled = true;

  try {
    const response = await fetch(
      "https://login-register02-production-85a9.up.railway.app/recovery",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      document.getElementById("sentTo").textContent = email;
      document.getElementById("stepEmail").classList.add("hidden");
      document.getElementById("stepSuccess").classList.remove("hidden");
    } else {
      errorEl.textContent = data.message;
      errorEl.classList.remove("hidden");
    }
  } catch (error) {
    showToast("Server error boss", "error");
  } finally {
    btn.textContent = "Kirim Link Reset";
    btn.disabled = false;
  }
}

function backToEmail() {
  document.getElementById("stepSuccess").classList.add("hidden");
  document.getElementById("stepEmail").classList.remove("hidden");
  document.getElementById("recovEmail").value = "";
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
