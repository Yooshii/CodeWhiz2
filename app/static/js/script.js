function switchSignup() {
  console.log("signup");
  const error = document.getElementById("centerModalError");
  const signup = document.getElementById("centerModalSignup");
  const login = document.getElementById("centerModalLogin");
  signup.classList.remove("hidden");
  login.classList.add("hidden");
  error.classList.add("hidden");
}

function switchLogin() {
  console.log("login");
  const error = document.getElementById("centerModalError");
  const signup = document.getElementById("centerModalSignup");
  const login = document.getElementById("centerModalLogin");
  signup.classList.add("hidden");
  error.classList.add("hidden");
  login.classList.remove("hidden");
}

function switchError() {
  console.log("error");
  const error = document.getElementById("centerModalError");
  const signup = document.getElementById("centerModalSignup");
  const login = document.getElementById("centerModalLogin");
  error.classList.remove("hidden");
  signup.classList.add("hidden");
  login.classList.add("hidden");
}

function openModalLogin() {
  const modal = document.getElementById("modalFullscreen");
  modal.classList.remove("hidden");
  switchLogin();
}

function openModalSignup() {
  const modal = document.getElementById("modalFullscreen");
  modal.classList.remove("hidden");
  switchSignup();
}

function openModalError() {
  const modal = document.getElementById("modalFullscreen");
  modal.classList.remove("hidden");
  switchError();
}

function dismiss() {
  const modal = document.getElementById("modalFullscreen");
  modal.classList.add("hidden");
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;
  const errorElement = document.getElementById("loginError");

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.location.href = data.redirect;
      } else {
        errorElement.textContent = data.error;
        errorElement.classList.remove("hidden");
      }
    })
    .catch((error) => {
      errorElement.textContent = "An error occurred. Please try again.";
      errorElement.classList.remove("hidden");
    });

  return false;
}

function signup() {
  const username = document.getElementById("signupUsername").value;
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPass").value;
  const errorElement = document.getElementById("signupError");

  fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, name, email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Signup data", data);
      if (data.success) {
        window.location.href = data.redirect;
      } else {
        errorElement.textContent = data.error;
        errorElement.classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.error(error);
      errorElement.textContent = "An error occurred. Please try again.";
      errorElement.classList.remove("hidden");
    });

  return false;
}

function showLeaderboard() {
  window.location.href = "/leaderboard";
}

const darkModeConfig = {
  plugins: {
    legend: {
      labels: { color: "#ffffff" },
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      angleLines: { color: "rgba(255, 255, 255, 0.3)" },
      grid: { color: "rgba(255, 255, 255, 0.3)" },
      pointLabels: { color: "#ffffff" },
      ticks: {
        color: "#ffffff",
        backdropColor: "transparent",
      },
    },
  },
  elements: {
    line: {
      borderWidth: 3,
      borderColor: "rgba(54, 162, 235, 0.8)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
    },
    point: {
      backgroundColor: "rgba(54, 162, 235, 1)",
    },
  },
};

let languageChart, categoryChart;

function createEmptyCharts() {
  // Language Chart
  languageChart = new Chart(document.getElementById("languageChart"), {
    type: "radar",
    data: {
      labels: ["Python", "Java", "C", "C++", "C#", "JavaScript"],
      datasets: [
        {
          label: "Language Scores",
          data: [0, 0, 0, 0, 0, 0], // Empty data initially
          borderWidth: 1,
        },
      ],
    },
    options: darkModeConfig,
  });

  // Category Chart
  categoryChart = new Chart(document.getElementById("categoryChart"), {
    type: "radar",
    data: {
      labels: [
        "Loops",
        "Conditionals",
        "Function",
        "Variables",
        "Arrays",
        "Debugging",
      ],
      datasets: [
        {
          label: "Category Scores",
          data: [0, 0, 0, 0, 0, 0], // Empty data initially
          borderWidth: 1,
        },
      ],
    },
    options: darkModeConfig,
  });
}

function selectedLanguage(language) {
  const langDropdown = document.getElementById("langDropdown");

  if (language === "python") {
    langDropdown.textContent = "Python";
  } else if (language === "java") {
    langDropdown.textContent = "Java";
  } else if (language === "c") {
    langDropdown.textContent = "C";
  } else if (language === "cpp") {
    langDropdown.textContent = "C++";
  } else if (language === "csharp") {
    langDropdown.textContent = "C#";
  } else if (language === "js") {
    langDropdown.textContent = "JavaScript";
  }

  updateCategoryChart(language);
}

// Update charts with real data
async function updateChartsData() {
  try {
    const response = await fetch("/scorechart");
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    const { language_scores, python_category_scores } = data;

    // Update language chart data
    languageChart.data.datasets[0].data = [
      language_scores.python_score,
      language_scores.java_score,
      language_scores.c_score,
      language_scores.cpp_score,
      language_scores.csharp_score,
      language_scores.js_score,
    ];
    languageChart.update("none"); // Update without animation for speed

    categoryChart.data.datasets[0].data = [
      python_category_scores.loops_score,
      python_category_scores.conditionals_score,
      python_category_scores.functions_score,
      python_category_scores.variables_score,
      python_category_scores.arrays_score,
      python_category_scores.debbuging_score,
    ];
    categoryChart.update("none");
  } catch (error) {
    console.error("Error fetching scores:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createEmptyCharts();
  // Fetch real data after empty charts are rendered
  updateChartsData();
});

async function updateCategoryChart(lang) {
  try {
    const response = await fetch("/scorechart");

    if (!response.ok) throw new Error("Failed to fetch category scores");

    const data = await response.json();
    if (lang === "python") {
      const { python_category_scores } = data;

      categoryChart.data.datasets[0].data = [
        python_category_scores.loops_score,
        python_category_scores.conditionals_score,
        python_category_scores.functions_score,
        python_category_scores.variables_score,
        python_category_scores.arrays_score,
        python_category_scores.debbuging_score,
      ];
    } else if (lang === "java") {
      const { java_category_scores } = data;

      categoryChart.data.datasets[0].data = [
        java_category_scores.loops_score,
        java_category_scores.conditionals_score,
        java_category_scores.functions_score,
        java_category_scores.variables_score,
        java_category_scores.arrays_score,
        java_category_scores.debbuging_score,
      ]
    } else if (lang === "c") {
      const { c_category_scores } = data;

      categoryChart.data.datasets[0].data = [
        c_category_scores.loops_score,
        c_category_scores.conditionals_score,
        c_category_scores.functions_score,
        c_category_scores.variables_score,
        c_category_scores.arrays_score,
        c_category_scores.debbuging_score,
      ]
    } else if (lang === "cpp") {
      const { cpp_category_scores } = data;

      categoryChart.data.datasets[0].data = [
        cpp_category_scores.loops_score,
        cpp_category_scores.conditionals_score,
        cpp_category_scores.functions_score,
        cpp_category_scores.variables_score,
        cpp_category_scores.arrays_score,
        cpp_category_scores.debbuging_score,
      ]
    } else if (lang === "csharp") {
      const { csharp_category_scores } = data;

      categoryChart.data.datasets[0].data = [
        csharp_category_scores.loops_score,
        csharp_category_scores.conditionals_score,
        csharp_category_scores.functions_score,
        csharp_category_scores.variables_score,
        csharp_category_scores.arrays_score,
        csharp_category_scores.debbuging_score,
      ]
    } else if (lang === "js") {
      const { js_category_scores } = data;

      categoryChart.data.datasets[0].data = [
        js_category_scores.loops_score,
        js_category_scores.conditionals_score,
        js_category_scores.functions_score,
        js_category_scores.variables_score,
        js_category_scores.arrays_score,
        js_category_scores.debbuging_score,
      ]
    }
    
    categoryChart.update("none");

  } catch(error) {
    console.error("Error fetching category scores:", error);
  }
}
