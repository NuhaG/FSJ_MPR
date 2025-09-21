document.getElementById("searchBtn").addEventListener("click", async () => {
  const food = document.getElementById("foodInput").value.trim();
  const resultDiv = document.getElementById("nutritionResult");

  if (!food) {
    resultDiv.innerHTML = "<p>Please enter a food item.</p>";
    return;
  }

  resultDiv.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `https://api.calorieninjas.com/v1/nutrition?query=${food}`,
      {
        headers: { "X-Api-Key": "1VO/hqFOBhv7aKNTLAPB/w==8diNkfvgNjC3pnIc" },
      }
    );

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    if (data.items.length === 0) {
      resultDiv.innerHTML = "<p>No nutrition info found.</p>";
      return;
    }
    console.log(data);

    const item = data.items[0];
    resultDiv.innerHTML = `
        <div class="nutrition-card">
        <h4><strong>${item.name.toUpperCase()}</strong></h4>
        <p><strong>Calories:</strong> ${item.calories} kcal</p>
        <p><strong>Protein:</strong> ${item.protein_g} g</p>
        <p><strong>Carbohydrates:</strong> ${item.carbohydrates_total_g} g</p>
        <p><strong>Fat:</strong> ${item.fat_total_g} g</p>
        </div>`;
  } catch (err) {
    resultDiv.innerHTML = "<p>Error fetching data. Please try again.</p>";
  }
});
