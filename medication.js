// ------------------ Load Medications ------------------
// Load meds from localStorage; if none exist, start with empty array
let meds = JSON.parse(localStorage.getItem("meds")) || [];

// ------------------ Utility Functions ------------------
// Save meds array to localStorage for persistence
function saveMeds() {
  localStorage.setItem("meds", JSON.stringify(meds));
}

// Render all meds in the UI
function renderMeds() {
  const list = document.getElementById("medList");
  list.innerHTML = ""; // Clear current list

  // Loop through meds and create HTML elements for each
  meds.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "med-item";
    div.innerHTML = `
      <div class="med-info">
        <div class="med-name">${m.name}</div>
        <div class="med-time">Time: ${m.time}</div>
        <div class="med-note">${m.note || ""}</div>
      </div>
      <button class="remove-btn" onclick="deleteMed(${i})">✖</button>`;
    list.appendChild(div);
  });

  getNextDose(); // Update next dose info & notifications
}

// ------------------ CRUD Functions ------------------
// Add new med from input fields
function addMedication() {
  const name = document.getElementById("medName").value.trim();
  const time = document.getElementById("medTime").value;
  const note = document.getElementById("medNote").value.trim();
  if (!name || !time) return alert("Please enter both name and time.");

  meds.push({ name, time, note, notified: false }); // Add new med object
  saveMeds(); // Save updated meds
  renderMeds(); // Refresh UI

  // Clear input fields after adding
  document.getElementById("medName").value = "";
  document.getElementById("medTime").value = "";
  document.getElementById("medNote").value = "";
}

// Delete medication at index i
function deleteMed(i) {
  if (confirm(`Delete medication "${meds[i].name}"?`)) {
    meds.splice(i, 1); // Remove med from array
    saveMeds(); // Update storage
    renderMeds(); // Refresh UI
  }
}

// ------------------ Notifications ------------------
// Request permission for browser notifications
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(perm => {
      if (perm === "granted") console.log("✅ Notifications enabled");
    });
  }
}

// Send browser notification with title, body, and icon
function sendNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "https://cdn-icons-png.flaticon.com/512/2942/2942910.png", // Pill icon
    });
  }
}

// ------------------ Dose Reminder ------------------
// Find next dose and trigger notification exactly on time
function getNextDose() {
  const now = new Date();
  if (!meds.length) {
    document.getElementById("nextDose").textContent = "No medications added.";
    return;
  }

  // Map meds to next scheduled time, adjust to tomorrow if time has passed
  let upcoming = meds
    .map(m => {
      const t = new Date(`${now.toDateString()} ${m.time}`);
      if (t < now) t.setDate(t.getDate() + 1); // move to tomorrow if passed
      return { ...m, diff: t - now }; // diff in ms
    })
    .sort((a, b) => a.diff - b.diff)[0]; // Pick soonest

  const hrs = Math.floor(upcoming.diff / 3600000);
  const mins = Math.floor((upcoming.diff % 3600000) / 60000);
  document.getElementById("nextDose").textContent = `Next: ${upcoming.name} in ${hrs}h ${mins}m`;

  // Trigger notification exactly at 0 ms difference (within 1 second)
  if (Math.abs(upcoming.diff) < 1000 && !upcoming.notified) {
    sendNotification("Medication Reminder", `Time for ${upcoming.name}!`);
    upcoming.notified = true;

    // Update the meds array to mark this as notified
    meds = meds.map(m => 
      m.name === upcoming.name && m.time === upcoming.time ? upcoming : m
    );
    saveMeds();
  }
}

// ------------------ Initialization ------------------
requestNotificationPermission(); // Ask for notifications on page load
renderMeds(); // Display saved meds immediately
setInterval(getNextDose, 1000); // Check every second for exact-time notifications
