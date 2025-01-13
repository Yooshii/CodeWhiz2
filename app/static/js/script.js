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

// const ctx1 = document.getElementById("languageChart");
// const ctx2 = document.getElementById("categoryChart");
// let pythonScore;
// let javaScore;
// let cScore;
// let cppScore;
// let csharpScore;
// let jsScore;

// fetch("/scorechart")
//   .then((response) => response.json())
//   .then((data) => {
//     pythonScore = data.language_scores.python_score
//     javaScore = data.language_scores.java_score
//     cScore = data.language_scores.c_score
//     cppScore = data.language_scores.cpp_score
//     csharpScore = data.language_scores.csharp_score
//     jsScore = data.language_scores.js_score

//     console.log(pythonScore, javaScore, cScore)

//     new Chart(ctx1, {
//       type: "radar",
//       data: {
//         labels: ["Python", "Java", "C", "C++", "C#", "JavaScript"],
//         datasets: [
//           {
//             label: "Language Scores",
//             data: [pythonScore, javaScore, cScore, cppScore, csharpScore, jsScore],
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         elements: {
//           line: {
//             borderWidth: 3,
//           },
//         },
//       },
//     });
    
//     new Chart(ctx2, {
//       type: "radar",
//       data: {
//         labels: [
//           "Loops",
//           "Conditionals",
//           "Function",
//           "Variables",
//           "Arrays",
//           "Debbugging",
//         ],
//         datasets: [
//           {
//             label: "Category Scores",
//             data: [12, 19, 3, 5, 2, 3],
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         elements: {
//           line: {
//             borderWidth: 3,
//           },
//         },
//       },
//     });
//   })
//   .catch((error) => console.error("Error fetching scores:", error));

const darkModeConfig = {
  plugins: {
      legend: {
          labels: { color: '#ffffff' }
      }
  },
  scales: {
      r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          pointLabels: { color: '#ffffff' },
          ticks: {
              color: '#ffffff',
              backdropColor: 'transparent'
          }
      }
  },
  elements: {
      line: {
          borderWidth: 3,
          borderColor: 'rgba(54, 162, 235, 0.8)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)'
      },
      point: {
          backgroundColor: 'rgba(54, 162, 235, 1)'
      }
  }
};

let languageChart, categoryChart;

function createEmptyCharts() {
    // Language Chart
    languageChart = new Chart(document.getElementById('languageChart'), {
        type: 'radar',
        data: {
            labels: ['Python', 'Java', 'C', 'C++', 'C#', 'JavaScript'],
            datasets: [{
                label: 'Language Scores',
                data: [0, 0, 0, 0, 0, 0], // Empty data initially
                borderWidth: 1
            }]
        },
        options: darkModeConfig
    });

    // Category Chart
    categoryChart = new Chart(document.getElementById('categoryChart'), {
        type: 'radar',
        data: {
            labels: ['Loops', 'Conditionals', 'Function', 'Variables', 'Arrays', 'Debugging'],
            datasets: [{
                label: 'Category Scores',
                data: [0, 0, 0, 0, 0, 0], // Empty data initially
                borderWidth: 1
            }]
        },
        options: darkModeConfig
    });
}

// Update charts with real data
async function updateChartsData() {
    try {
        const response = await fetch('/scorechart');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        const { language_scores } = data;

        // Update language chart data
        languageChart.data.datasets[0].data = [
            language_scores.python_score,
            language_scores.java_score,
            language_scores.c_score,
            language_scores.cpp_score,
            language_scores.csharp_score,
            language_scores.js_score
        ];
        languageChart.update('none'); // Update without animation for speed

        // Update category chart data
        categoryChart.data.datasets[0].data = [12, 19, 3, 5, 2, 3];
        categoryChart.update('none'); // Update without animation for speed

    } catch (error) {
        console.error('Error fetching scores:', error);
    }
}

// Initialize empty charts immediately when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    createEmptyCharts();
    // Fetch real data after empty charts are rendered
    updateChartsData();
});