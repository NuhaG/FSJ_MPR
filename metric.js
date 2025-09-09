// Water
let water = parseInt(localStorage.getItem("water")) || 0;
const maxWater = 8;
const waterCount = document.getElementById("waterCount");
const waterProgress = document.getElementById("waterProgress");
document.getElementById("drinkWater").addEventListener("click", () => {
  if (water < maxWater) water++;
  localStorage.setItem("water", water);
  updateWater();
});
function updateWater() {
  waterCount.textContent = `${water}/${maxWater}`;
  waterProgress.style.width = `${(water / maxWater) * 100}%`;
}
updateWater();

// Steps
let steps = parseInt(localStorage.getItem("steps")) || 0;
const stepsCount = document.getElementById("stepsCount");
document.getElementById("saveSteps").addEventListener("click", () => {
  steps = parseInt(document.getElementById("stepsInput").value) || 0;
  localStorage.setItem("steps", steps);
  stepsCount.textContent = steps;
});
stepsCount.textContent = steps;

// Heart Rate
let heart = parseInt(localStorage.getItem("heart")) || 70;
const heartCount = document.getElementById("heartCount");
document.getElementById("saveHeart").addEventListener("click", () => {
  heart = parseInt(document.getElementById("heartInput").value) || 70;
  localStorage.setItem("heart", heart);
  heartCount.textContent = heart;
});
heartCount.textContent = heart;
