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
      <div class="med-actions">
        <input type="checkbox" onchange="markTaken(${i}, this)" ${m.taken ? "checked" : ""}>
        <button onclick="deleteMed(${i})">✖</button>
      </div>`;
    list.appendChild(div); // Add to DOM
  });

  updateProgress(); // Update progress bar
  getNextDose(); // Update next dose info & notifications
}

// ------------------ CRUD Functions ------------------

// Add new med from input fields
function addMedication() {
  const name = document.getElementById("medName").value.trim();
  const time = document.getElementById("medTime").value;
  const note = document.getElementById("medNote").value.trim();
  if (!name || !time) return alert("Please enter both name and time."); // Validate inputs

  meds.push({ name, time, note, taken: false }); // Add new med object
  saveMeds(); // Save updated meds
  renderMeds(); // Refresh UI

  // Clear input fields after adding
  document.getElementById("medName").value = "";
  document.getElementById("medTime").value = "";
  document.getElementById("medNote").value = "";
}

// Delete medication at index i
function deleteMed(i) {
  meds.splice(i, 1); // Remove med from array
  saveMeds(); // Update storage
  renderMeds(); // Refresh UI
}

// Mark medication as taken or not taken
function markTaken(i, checkbox) {
  meds[i].taken = checkbox.checked; // Update status
  saveMeds(); // Persist change
  updateProgress(); // Update progress bar
}

// ------------------ Progress & Search ------------------

// Update progress bar width based on number of taken meds
function updateProgress() {
  const taken = meds.filter(m => m.taken).length;
  const percent = meds.length ? (taken / meds.length) * 100 : 0;
  document.getElementById("progressBar").style.width = percent + "%";
}

// Filter meds displayed by search query
function filterMeds() {
  const query = document.getElementById("searchMed").value.toLowerCase();
  document.querySelectorAll(".med-item").forEach(item => {
    const name = item.querySelector(".med-name").textContent.toLowerCase();
    item.style.display = name.includes(query) ? "flex" : "none"; // Show/hide item
  });
}

// ------------------ Notifications ------------------

// Request permission for browser notifications
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(perm => {
      if (perm === "granted") console.log("Notifications enabled");
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

// Find next dose and trigger notification if close
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
      if (t < now) t.setDate(t.getDate() + 1);
      return { ...m, diff: t - now }; // diff in ms
    })
    .sort((a, b) => a.diff - b.diff)[0]; // Pick soonest

  const hrs = Math.floor(upcoming.diff / 3600000);
  const mins = Math.floor((upcoming.diff % 3600000) / 60000);
  document.getElementById("nextDose").textContent = `Next: ${upcoming.name} in ${hrs}h ${mins}m`;

  // Notify if within 5 minutes
  if (upcoming.diff > 0 && upcoming.diff < 5 * 60 * 1000) {
    sendNotification("Medication Reminder", `It's almost time for ${upcoming.name}!`);
  }
}

// ------------------ Initialization ------------------

// Ask for notifications on page load
requestNotificationPermission();

// Display saved meds immediately
renderMeds();

// Check every minute for next dose
setInterval(getNextDose, 60000);
