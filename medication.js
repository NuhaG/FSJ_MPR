/* ============================================================
   Medication Tracker – JavaScript Logic
   Handles all medication management, reminders, notifications,
   and progress tracking.
   ============================================================ */

// Load medications from localStorage (persistent storage)
let meds = JSON.parse(localStorage.getItem("meds")) || [];

/* ------------------------------------------------------------
   Utility Functions
------------------------------------------------------------ */

// Save medications array back to localStorage
function saveMeds() {
  localStorage.setItem("meds", JSON.stringify(meds));
}

// Re-render all medications to the UI
function renderMeds() {
  const list = document.getElementById("medList");
  list.innerHTML = "";

  // Create medication cards dynamically
  meds.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "med-item";
    div.innerHTML = `
      <div class="med-info">
        <div class="med-name">${m.name}</div>
        <div class="med-time">Time: ${m.time}</div>
        <div class="med-note">${m.note || ""}</div>
      </div>
      <div class="med-actions">
        <input type="checkbox" onchange="markTaken(${i}, this)" ${m.taken ? "checked" : ""}>
        <button onclick="deleteMed(${i})">✖</button>
      </div>
    `;
    list.appendChild(div);
  });

  updateProgress();
  getNextDose();
}

/* ------------------------------------------------------------
   CRUD (Create, Read, Update, Delete) Functions
------------------------------------------------------------ */

// Add a new medication to the list
function addMedication() {
  const name = document.getElementById("medName").value.trim();
  const time = document.getElementById("medTime").value;
  const note = document.getElementById("medNote").value.trim();

  if (!name || !time) return alert("Please enter both name and time.");

  meds.push({ name, time, note, taken: false });
  saveMeds();
  renderMeds();

  // Reset input fields
  document.getElementById("medName").value = "";
  document.getElementById("medTime").value = "";
  document.getElementById("medNote").value = "";
}

// Delete a medication by index
function deleteMed(i) {
  meds.splice(i, 1);
  saveMeds();
  renderMeds();
}

// Mark medication as taken (checkbox)
function markTaken(i, checkbox) {
  meds[i].taken = checkbox.checked;
  saveMeds();
  updateProgress();
}

/* ------------------------------------------------------------
   Progress & Search
------------------------------------------------------------ */

// Update the progress bar based on taken meds
function updateProgress() {
  const taken = meds.filter((m) => m.taken).length;
  const total = meds.length;
  const percent = total ? (taken / total) * 100 : 0;
  document.getElementById("progressBar").style.width = percent + "%";
}

// Filter visible medications by name
function filterMeds() {
  const query = document.getElementById("searchMed").value.toLowerCase();
  document.querySelectorAll(".med-item").forEach((item) => {
    const name = item.querySelector(".med-name").textContent.toLowerCase();
    item.style.display = name.includes(query) ? "flex" : "none";
  });
}

/* ------------------------------------------------------------
   Notifications (Browser Desktop Notifications)
------------------------------------------------------------ */

// Ask for browser notification permission once
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") console.log("✅ Notifications enabled");
    });
  }
}

// Send a desktop notification
function sendNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "https://cdn-icons-png.flaticon.com/512/2942/2942910.png", // small pill icon
    });
  }
}

/* ------------------------------------------------------------
   Dose Reminder Logic
------------------------------------------------------------ */

// Calculate and display the next upcoming dose
function getNextDose() {
  const now = new Date();

  if (meds.length === 0) {
    document.getElementById("nextDose").textContent = "No medications added.";
    return;
  }

  // Find the next upcoming medication
  let upcoming = meds
    .map((m) => {
      const doseTime = new Date(`${now.toDateString()} ${m.time}`);
      if (doseTime < now) doseTime.setDate(doseTime.getDate() + 1); // move to tomorrow if passed
      return { ...m, diff: doseTime - now };
    })
    .sort((a, b) => a.diff - b.diff)[0];

  const hrs = Math.floor(upcoming.diff / 3600000);
  const mins = Math.floor((upcoming.diff % 3600000) / 60000);

  // Update text on screen
  document.getElementById(
    "nextDose"
  ).textContent = `Next: ${upcoming.name} in ${hrs}h ${mins}m`;

  // Trigger a desktop notification 5 minutes before
  if (upcoming.diff < 5 * 60 * 1000 && upcoming.diff > 0) {
    sendNotification("Medication Reminder", `It's almost time for ${upcoming.name}!`);
  }
}

/* ------------------------------------------------------------
   Initialization
------------------------------------------------------------ */

// Request notification permission when page loads
requestNotificationPermission();

// Render stored medications on startup
renderMeds();

// Check for next dose every minute
setInterval(getNextDose, 60000);
