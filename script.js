let expenses = [];
let chart;

// ADD
function addExpense() {
  let desc = document.getElementById("desc").value;
  let amount = document.getElementById("amount").value;
  let category = document.getElementById("category").value;
  let date = document.getElementById("date").value;

  if (!desc || !amount || !date) {
    alert("Fill all fields");
    return;
  }

  expenses.push({
    desc: desc,
    amount: parseFloat(amount),
    category: category,
    date: date
  });

  updateUI();

  // clear
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";
}

// UPDATE UI
function updateUI() {
  let list = document.getElementById("list");
  list.innerHTML = "";

  let total = 0;

  let search = document.getElementById("search").value.toLowerCase();

expenses
  .filter(e => 
    e.desc.toLowerCase().includes(search) ||
    e.category.toLowerCase().includes(search)
  )
  .forEach(e => {
    total += e.amount;

    let li = document.createElement("li");
    li.innerHTML = `
      ${e.desc} - ₹${e.amount} <br>
      <small>${e.category} | ${e.date}</small>
    `;

    list.appendChild(li);
  });

  document.getElementById("total").innerText = total;

  updateChart();
  updateInsight();
  updatePrediction();
}

// CHART
function updateChart() {
  let categories = {
    Food: 0,
    Travel: 0,
    Shopping: 0,
    Other: 0
  };

  expenses.forEach(e => {
    categories[e.category] += e.amount;
  });

  let ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories)
      }]
    }
  });
}

// INSIGHT
function updateInsight() {
  if (expenses.length === 0) {
    document.getElementById("insight").innerText = "";
    return;
  }

  let categories = {};

  expenses.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });

  let max = Object.keys(categories).reduce((a, b) =>
    categories[a] > categories[b] ? a : b
  );

  document.getElementById("insight").innerText =
    "⚠️ Highest spending on " + max;
}

// PREDICTION
function updatePrediction() {
  if (expenses.length === 0) {
    document.getElementById("prediction").innerText = "";
    return;
  }

  let total = expenses.reduce((sum, e) => sum + e.amount, 0);
  let avg = total / expenses.length;

  document.getElementById("prediction").innerText =
    "📈 Avg Expense: ₹" + Math.round(avg);
}