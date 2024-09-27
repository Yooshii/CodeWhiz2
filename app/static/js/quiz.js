function createElement(type, props = {}, ...children) {
  const element = document.createElement(type);
  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      element.setAttribute("class", value);
    } else if (key.startsWith("on")) {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element[key] = value;
    }
  });
  children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  });
  return element;
}

// Trivia Card Component
function TriviaCard({ name, category, emoji, bgColor, desc, onClick }) {
  return createElement(
    "div",
    { className: "group cursor-pointer", onClick },
    createElement(
      "div",
      {
        className: `h-60 flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl`,
      },
      createElement(
        "div",
        {
          className: `w-24 h-24 ${bgColor} rounded-full flex items-center justify-center mb-4 group-hover:animate-pulse`,
        },
        createElement("span", { className: "text-4xl" }, emoji)
      ),
      createElement(
        "h3",
        { className: "text-xl font-bold text-white mb-1" },
        name
      ),
      createElement("p", { className: "text-sm text-gray-400" }, category),
      createElement(
        "p",
        { className: "text-xs text-gray-500 mt-6 text-center" },
        desc
      )
    )
  );
}

// Level Selection Component
function LevelSelection({ category, levels, onStart }) {
  const levelButtons = levels.map((level, index) =>
    createElement(
      "button",
      {
        className: `w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
          index === 0 ? "bg-primary text-white" : "bg-gray-700 text-gray-300"
        } hover:bg-primary hover:text-white transition-colors`,
        onClick: () => onStart(level),
      },
      level.toString()
    )
  );

  return createElement(
    "div",
    {
      className:
        "bg-gray-800 rounded-lg p-8 max-w-md mx-auto w-full text-center",
    },
    createElement(
      "h2",
      { className: "text-3xl font-bold mb-6 text-primary" },
      `${category}`
    ),
    createElement("p", { className: "mb-4 text-xl" }, "Select a Level:"),
    createElement(
      "div",
      { className: "flex justify-center space-x-4 mb-8" },
      ...levelButtons
    ),
    createElement(
      "button",
      {
        className:
          "bg-secondary text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-secondary/80 transition-colors",
        onClick: () => onStart(1),
      },
      "Start Quiz"
    )
  );
}

let questions = {};

// Quiz Question Component
function QuizQuestion({
  question,
  options,
  onAnswer,
  timeLeft,
  questionNumber,
  totalQuestions,
}) {
  const optionButtons = options.map((option) =>
    createElement(
      "button",
      {
        className:
          "w-full py-3 px-4 bg-gray-700 hover:bg-primary text-left rounded-lg transition-colors",
        onClick: () => onAnswer(option),
      },
      option
    )
  );

  return createElement(
    "div",
    { className: "bg-gray-800 rounded-lg p-8 max-w-md mx-auto w-full" },
    createElement(
      "div",
      { className: "flex justify-between items-center mb-6" },
      createElement(
        "span",
        { className: "text-xl font-semibold" },
        `${questionNumber}/${totalQuestions}`
      ),
      createElement(
        "span",
        { className: "text-xl font-semibold text-primary" },
        `${timeLeft}s`
      )
    ),
    createElement("h2", { className: "text-2xl mb-6" }, question),
    createElement("div", { className: "space-y-3" }, ...optionButtons)
  );
}

// Main App Logic
const mainContent = document.getElementById("mainContent");
let currentLanguage = "";
let currentCategory = "";
let currentLevel = 1;
let score = 0;
let questionIndex = 0;
let timeLeft = 30;
let timer;

const quizData = {
  Pyther: {
    name: "Pyther",
    category: "Python",
    emoji: "🐍",
    bgColor: "bg-green-500",
    desc: "A Matrixmon that uses its Python-based attacks with cunning precision",
    subcategories: [
      { name: "Loops", category: "", emoji: "🔄", bgColor: "bg-blue-500" },
      {
        name: "Conditionals",
        category: "",
        emoji: "🔀",
        bgColor: "bg-green-500",
      },
      {
        name: "Functions",
        category: "",
        emoji: "🧩",
        bgColor: "bg-yellow-500",
      },
      {
        name: "Variables",
        category: "",
        emoji: "📦",
        bgColor: "bg-purple-500",
      },
      { name: "Arrays", category: "", emoji: "📚", bgColor: "bg-red-500" },
      {
        name: "Debugging",
        category: "",
        emoji: "🐞",
        bgColor: "bg-pink-500",
      },
    ],
  },
  Javascropt: {
    name: "Javascropt",
    category: "JavaScript",
    emoji: "🦂",
    bgColor: "bg-orange-500",
    desc: "A dynamic Matrixmon that brings interactive creativity to life",
    subcategories: [
      { name: "Loops", category: "", emoji: "🔄", bgColor: "bg-blue-500" },
      {
        name: "Conditionals",
        category: "",
        emoji: "🔀",
        bgColor: "bg-green-500",
      },
      {
        name: "Functions",
        category: "",
        emoji: "🧩",
        bgColor: "bg-yellow-500",
      },
      {
        name: "Variables",
        category: "",
        emoji: "📦",
        bgColor: "bg-purple-500",
      },
      { name: "Arrays", category: "", emoji: "📚", bgColor: "bg-red-500" },
      {
        name: "Debugging",
        category: "",
        emoji: "🐞",
        bgColor: "bg-pink-500",
      },
    ],
  },
  CPlushy: {
    name: "CPlushy",
    category: "C++",
    emoji: "🐱",
    bgColor: "bg-yellow-500",
    desc: "A playful and curious Matrixmon that loves engaging experiences",
    subcategories: [
      { name: "Loops", category: "", emoji: "🔄", bgColor: "bg-blue-500" },
      {
        name: "Conditionals",
        category: "",
        emoji: "🔀",
        bgColor: "bg-green-500",
      },
      {
        name: "Functions",
        category: "",
        emoji: "🧩",
        bgColor: "bg-yellow-500",
      },
      {
        name: "Variables",
        category: "",
        emoji: "📦",
        bgColor: "bg-purple-500",
      },
      { name: "Arrays", category: "", emoji: "📚", bgColor: "bg-red-500" },
      {
        name: "Debugging",
        category: "",
        emoji: "🐞",
        bgColor: "bg-pink-500",
      },
    ],
  },
};

function showSubcategorySelection() {
  mainContent.innerHTML = "";
  const container = createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-3 gap-8",
  });
  quizData[currentLanguage].subcategories.forEach((subcategory) => {
    container.appendChild(
      TriviaCard({
        ...subcategory,
        onClick: () => {
          currentCategory = subcategory.name;
          console.log("Selected category:", currentCategory);
          showLevelSelection();
        },
      })
    );
  });
  mainContent.appendChild(
    createElement(
      "h2",
      { className: "text-4xl font-bold mb-12 text-center text-primary" },
      `Choose Your ${currentLanguage} Challenge`
    )
  );
  mainContent.appendChild(container);
  addBackButton(showLanguageSelection);
}

function showLanguageSelection() {
  mainContent.innerHTML = "";
  const container = createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-3 gap-8",
  });
  Object.values(quizData).forEach((language) => {
    container.appendChild(
      TriviaCard({
        ...language,
        onClick: () => {
          currentLanguage = language.name;
          showSubcategorySelection();
        },
      })
    );
  });
  mainContent.appendChild(
    createElement(
      "h2",
      { className: "text-4xl font-bold mb-12 text-center text-primary" },
      "Choose Your Coding Language"
    )
  );
  mainContent.appendChild(container);
}

function showLevelSelection() {
  console.log("Showing level selection for category:", currentCategory);
  mainContent.innerHTML = "";
  mainContent.appendChild(
    LevelSelection({
      category: currentCategory,
      levels: [1, 2, 3, 4, 5],
      onStart: startQuiz,
    })
  );
  addBackButton(showSubcategorySelection);
}

function LevelSelection({ category, levels, onStart }) {
  console.log("Rendering LevelSelection component");
  let selectedLevel = 1; // Default selected level

  const levelButtons = levels.map((level) =>
    createElement(
      "button",
      {
        className: `w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
          level === selectedLevel
            ? "bg-primary text-white"
            : "bg-gray-700 text-gray-300"
        } hover:bg-primary hover:text-white transition-colors`,
        onClick: () => {
          selectedLevel = level;
          updateLevelButtons();
        },
      },
      level.toString()
    )
  );

  function updateLevelButtons() {
    levelButtons.forEach((button, index) => {
      button.className = `w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
        index + 1 === selectedLevel
          ? "bg-primary text-white"
          : "bg-gray-700 text-gray-300"
      } hover:bg-primary hover:text-white transition-colors`;
    });
  }

  const startButton = createElement(
    "button",
    {
      className:
        "bg-secondary text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-secondary/80 transition-colors",
      onClick: () => onStart(selectedLevel),
    },
    "Start Quiz"
  );

  return createElement(
    "div",
    {
      className:
        "bg-gray-800 rounded-lg p-8 max-w-md mx-auto w-full text-center",
    },
    createElement(
      "h2",
      { className: "text-3xl font-bold mb-6 text-primary" },
      `${category}`
    ),
    createElement("p", { className: "mb-4 text-xl" }, "Select a Level:"),
    createElement(
      "div",
      { className: "flex justify-center space-x-4 mb-8" },
      ...levelButtons
    ),
    startButton
  );
}

async function startQuiz(level) {
  console.log(
    "Starting quiz for category:",
    currentCategory,
    "at level:",
    level
  );
  currentLevel = level;
  questionIndex = 0;
  score = 0;

  showLoadingIndicator();

  try {
    const response = await fetch("/generate_questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: currentLanguage,
        category: currentCategory,
        level: currentLevel,
        num_questions: 5,
      }),
    });

    const data = await response.json();

    if (!questions[currentLanguage]) {
      questions[currentLanguage] = {};
    }
    if (!questions[currentLanguage][currentCategory]) {
      questions[currentLanguage][currentCategory] = {};
    }

    questions[currentLanguage][currentCategory][currentLevel] = data;

    hideLoadingIndicator();

    if (data.length === 0) {
      mainContent.innerHTML =
        "<p>You have completed all available questions for this category and level. Try a different category or level!</p>";
    } else {
      showQuestion();
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    mainContent.innerHTML = "<p>Error loading questions. Please try again.</p>";
    hideLoadingIndicator();
  }
}

function showLoadingIndicator() {
  const loadingIndicator = createElement(
    "div",
    {
      className: "text-center py-4",
    },
    "Loading questions..."
  );
  mainContent.appendChild(loadingIndicator);
}

function hideLoadingIndicator() {
  const loadingIndicator = mainContent.querySelector("div:last-child");
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

function showQuestion() {
  const levelQuestions =
    questions[currentLanguage][currentCategory][currentLevel];
  if (questionIndex >= levelQuestions.length) {
    showResult();
    return;
  }

  const question = levelQuestions[questionIndex];
  timeLeft = 30;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      questionIndex++;
      showQuestion();
    }
  }, 1000);

  mainContent.innerHTML = "";
  mainContent.appendChild(
    QuizQuestion({
      question: question.question,
      options: question.options,
      onAnswer: checkAnswer,
      timeLeft: timeLeft,
      questionNumber: questionIndex + 1,
      totalQuestions: levelQuestions.length,
    })
  );
  addBackButton(() => {
    clearInterval(timer);
    showLevelSelection();
  });
}

function checkAnswer(answer) {
  clearInterval(timer);
  const levelQuestions =
    questions[currentLanguage][currentCategory][currentLevel];
  if (answer === levelQuestions[questionIndex].correctAnswer) {
    score++;
  }
  questionIndex++;
  showQuestion();
}

function updateTimerDisplay() {
  const timerElement = mainContent.querySelector(".text-primary");
  if (timerElement) {
    timerElement.textContent = `${timeLeft}s`;
  }
}

function showResult() {
  mainContent.innerHTML = "";
  mainContent.appendChild(
    createElement(
      "div",
      {
        className:
          "bg-gray-800 rounded-lg p-8 max-w-md mx-auto w-full text-center",
      },
      createElement(
        "h2",
        { className: "text-3xl font-bold mb-6 text-primary" },
        "Quiz Complete!"
      ),
      createElement(
        "p",
        { className: "text-2xl mb-6" },
        `Your score: ${score}/${questions[currentLanguage][currentCategory][currentLevel].length}`
      ),
      createElement(
        "button",
        {
          className:
            "bg-secondary text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-secondary/80 transition-colors mr-4",
          onClick: () => startQuiz(currentLevel),
        },
        "Play Again"
      ),
      createElement(
        "button",
        {
          className:
            "bg-primary text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-primary/80 transition-colors",
          onClick: showLanguageSelection,
        },
        "Back to Languages"
      )
    )
  );
  updateScore(score);
  addBackButton(showSubcategorySelection);
}

function addBackButton(onClick) {
  const backButton = createElement(
    "button",
    {
      className: "mt-4 text-gray-400 hover:text-white transition",
      onClick: onClick,
    },
    "← Back"
  );
  mainContent.appendChild(backButton);
}

function updateScore(score) {
  fetch("/update_score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score: score }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Score updated successfully");
      } else {
        console.error("Failed to update score");
      }
    });
}

function showLeaderboard() {
  window.location.href = "/leaderboard";
}

window.addEventListener("scroll", function () {
  var nav = document.querySelector("nav");
  nav.classList.toggle("sticky", window.scrollY > 0);
});

// Initialize the app
showLanguageSelection();
