// script.js — replace file contents with this
const form = document.getElementById("bookingForm");
const msgEl = document.getElementById("confirmationMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    date: formData.get("date"),
    time: formData.get("time")
  };

  msgEl.textContent = "Processing your booking…";
  msgEl.style.color = "#555";

  try {
    const res = await fetch("http://localhost:8080/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Booking failed");

    msgEl.textContent = data.message;
    msgEl.style.color = "#ff1493";
    form.reset();
  } catch (err) {
    msgEl.textContent = `❗ ${err.message}`;
    msgEl.style.color = "crimson";
  }
});
