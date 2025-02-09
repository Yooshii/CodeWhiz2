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
        createElement("span", { className: "", innerHTML: emoji })
      ),
      createElement(
        "h3",
        { className: "text-xl font-bold text-white mb-1" },
        name
      ),
      createElement(
        "p",
        { className: "text-xs text-gray-500 mt-2 text-center" },
        desc
      )
    )
  );
}

let questions = {};

function QuizQuestion({
  question,
  options,
  onAnswer,
  timeLeft,
  questionNumber,
  totalQuestions,
  correctAnswer = null,
  selectedAnswer = null,
}) {
  const editorContainer = createElement("div", {
    id: `editor-${questionNumber}`,
    className: "w-full h-5/6 mb-6",
  });

  const getOptionClass = (option) => {
    const baseClass = "w-full py-3 px-4 text-left rounded-lg transition-colors";

    if (correctAnswer === null) {
      return baseClass + " bg-gray-700 hover:bg-[#f12b18]";
    }

    if (option === correctAnswer) {
      return baseClass + " bg-green-600";
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return baseClass + " bg-red-600";
    }

    return baseClass + " bg-gray-700";
  };

  const optionButtons = options.map((option) =>
    createElement(
      "button",
      {
        className: getOptionClass(option),
        onClick: () => onAnswer(option),
        disabled: correctAnswer !== null,
      },
      option
    )
  );

  return createElement(
    "div",
    {
      className:
        "bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto w-full flex space-x-8",
    },
    createElement(
      "div",
      { className: "flex-1" },
      createElement(
        "div",
        { className: "flex justify-between items-center mb-6" },
        createElement(
          "span",
          { className: "text-xl font-semibold text-white" },
          `${questionNumber}/${totalQuestions}`
        ),
        createElement(
          "span",
          { className: "time text-xl font-semibold text-[#f12b18]" },
          `${timeLeft}s`
        )
      ),
      createElement("h2", { className: "text-2xl mb-6 text-white" }, question),
      createElement(
        "div",
        { className: "space-y-3 text-white" },
        ...optionButtons
      )
    )
  );
}

const mainContent = document.getElementById("mainContent");
let currentLanguage = "";
let currentCategory = "";
let currentLevel = 1;
let score = 0;
let questionIndex = 0;
let timeLeft = 30;
let timer;

const quizData = {
  Python: {
    name: "Python",
    editorName: "python",
    emoji: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="100" viewBox="0 0 48 48">
<path fill="#0277BD" d="M24.047,5c-1.555,0.005-2.633,0.142-3.936,0.367c-3.848,0.67-4.549,2.077-4.549,4.67V14h9v2H15.22h-4.35c-2.636,0-4.943,1.242-5.674,4.219c-0.826,3.417-0.863,5.557,0,9.125C5.851,32.005,7.294,34,9.931,34h3.632v-5.104c0-2.966,2.686-5.896,5.764-5.896h7.236c2.523,0,5-1.862,5-4.377v-8.586c0-2.439-1.759-4.263-4.218-4.672C27.406,5.359,25.589,4.994,24.047,5z M19.063,9c0.821,0,1.5,0.677,1.5,1.502c0,0.833-0.679,1.498-1.5,1.498c-0.837,0-1.5-0.664-1.5-1.498C17.563,9.68,18.226,9,19.063,9z"></path><path fill="#FFC107" d="M23.078,43c1.555-0.005,2.633-0.142,3.936-0.367c3.848-0.67,4.549-2.077,4.549-4.67V34h-9v-2h9.343h4.35c2.636,0,4.943-1.242,5.674-4.219c0.826-3.417,0.863-5.557,0-9.125C41.274,15.995,39.831,14,37.194,14h-3.632v5.104c0,2.966-2.686,5.896-5.764,5.896h-7.236c-2.523,0-5,1.862-5,4.377v8.586c0,2.439,1.759,4.263,4.218,4.672C19.719,42.641,21.536,43.006,23.078,43z M28.063,39c-0.821,0-1.5-0.677-1.5-1.502c0-0.833,0.679-1.498,1.5-1.498c0.837,0,1.5,0.664,1.5,1.498C29.563,38.32,28.899,39,28.063,39z"></path>
</svg>`,
    bgColor: "bg-blue-800",
    desc: "Python is a high-level, versatile programming language known for its readability and simplicity.",
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
  Java: {
    name: "Java",
    editorName: "java",
    emoji: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="100" viewBox="0 0 48 48">
    <path fill="#F44336" d="M23.65,24.898c-0.998-1.609-1.722-2.943-2.725-5.455C19.229,15.2,31.24,11.366,26.37,3.999c2.111,5.089-7.577,8.235-8.477,12.473C17.07,20.37,23.645,24.898,23.65,24.898z"></path><path fill="#F44336" d="M23.878,17.27c-0.192,2.516,2.229,3.857,2.299,5.695c0.056,1.496-1.447,2.743-1.447,2.743s2.728-0.536,3.579-2.818c0.945-2.534-1.834-4.269-1.548-6.298c0.267-1.938,6.031-5.543,6.031-5.543S24.311,11.611,23.878,17.27z"></path><g><path fill="#1565C0" d="M32.084 25.055c1.754-.394 3.233.723 3.233 2.01 0 2.901-4.021 5.643-4.021 5.643s6.225-.742 6.225-5.505C37.521 24.053 34.464 23.266 32.084 25.055zM29.129 27.395c0 0 1.941-1.383 2.458-1.902-4.763 1.011-15.638 1.147-15.638.269 0-.809 3.507-1.638 3.507-1.638s-7.773-.112-7.773 2.181C11.683 28.695 21.858 28.866 29.129 27.395z"></path><path fill="#1565C0" d="M27.935,29.571c-4.509,1.499-12.814,1.02-10.354-0.993c-1.198,0-2.974,0.963-2.974,1.889c0,1.857,8.982,3.291,15.63,0.572L27.935,29.571z"></path><path fill="#1565C0" d="M18.686,32.739c-1.636,0-2.695,1.054-2.695,1.822c0,2.391,9.76,2.632,13.627,0.205l-2.458-1.632C24.271,34.404,17.014,34.579,18.686,32.739z"></path><path fill="#1565C0" d="M36.281,36.632c0-0.936-1.055-1.377-1.433-1.588c2.228,5.373-22.317,4.956-22.317,1.784c0-0.721,1.807-1.427,3.477-1.093l-1.42-0.839C11.26,34.374,9,35.837,9,37.017C9,42.52,36.281,42.255,36.281,36.632z"></path><path fill="#1565C0" d="M39,38.604c-4.146,4.095-14.659,5.587-25.231,3.057C24.341,46.164,38.95,43.628,39,38.604z"></path></g>
    </svg>`,
    bgColor: "bg-yellow-500",
    desc: "Java is a popular, object-oriented language valued for its portability and robustness.",
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
  C: {
    name: "C",
    editorName: "c",
    emoji: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="100" viewBox="0 0 48 48">
<path fill="#283593" fill-rule="evenodd" d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0 c3.355,1.883,13.451,7.551,16.807,9.434C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867 c0,0.762-0.418,1.466-1.097,1.847c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0 c-3.355-1.883-13.451-7.551-16.807-9.434C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867 c0-0.762,0.418-1.466,1.097-1.847C9.451,10.837,19.549,5.169,22.903,3.286z" clip-rule="evenodd"></path><path fill="#5c6bc0" fill-rule="evenodd" d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255 c0-3.744,0-15.014,0-18.759c0-0.758,0.417-1.458,1.094-1.836c3.343-1.872,13.405-7.507,16.748-9.38 c0.677-0.379,1.594-0.371,2.271,0.008c3.343,1.872,13.371,7.459,16.714,9.331c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M24,10c7.727,0,14,6.273,14,14s-6.273,14-14,14 s-14-6.273-14-14S16.273,10,24,10z M24,17c3.863,0,7,3.136,7,7c0,3.863-3.137,7-7,7s-7-3.137-7-7C17,20.136,20.136,17,24,17z" clip-rule="evenodd"></path><path fill="#3949ab" fill-rule="evenodd" d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784 c0,3.795-0.032,14.589,0.009,18.384c0.004,0.396-0.127,0.813-0.323,1.127L23.593,24L42.485,13.205z" clip-rule="evenodd"></path>
</svg>`,
    bgColor: "bg-blue-500",
    desc: "C is a foundational, low-level language that offers direct access to hardware.",
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
  Cpp: {
    name: "C++",
    editorName: "cpp",
    emoji: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="100" viewBox="0 0 48 48">
<path fill="#00549d" fill-rule="evenodd" d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0 c3.355,1.883,13.451,7.551,16.807,9.434C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867 c0,0.762-0.418,1.466-1.097,1.847c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0 c-3.355-1.883-13.451-7.551-16.807-9.434C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867 c0-0.762,0.418-1.466,1.097-1.847C9.451,10.837,19.549,5.169,22.903,3.286z" clip-rule="evenodd"></path><path fill="#0086d4" fill-rule="evenodd" d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255 c0-3.744,0-15.014,0-18.759c0-0.758,0.417-1.458,1.094-1.836c3.343-1.872,13.405-7.507,16.748-9.38 c0.677-0.379,1.594-0.371,2.271,0.008c3.343,1.872,13.371,7.459,16.714,9.331c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M24,10c7.727,0,14,6.273,14,14s-6.273,14-14,14 s-14-6.273-14-14S16.273,10,24,10z M24,17c3.863,0,7,3.136,7,7c0,3.863-3.137,7-7,7s-7-3.137-7-7C17,20.136,20.136,17,24,17z" clip-rule="evenodd"></path><path fill="#0075c0" fill-rule="evenodd" d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784 c0,3.795-0.032,14.589,0.009,18.384c0.004,0.396-0.127,0.813-0.323,1.127L23.593,24L42.485,13.205z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M31 21H33V27H31zM38 21H40V27H38z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M29 23H35V25H29zM36 23H42V25H36z" clip-rule="evenodd"></path>
</svg>`,
    bgColor: "bg-[#005A9C]",
    desc: "C++ builds on C, adding object-oriented features and libraries that make it powerful for both system and application development.",
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
  Csharp: {
    name: "C#",
    editorName: "csharp",
    emoji: `<svg
  xmlns:ns0="http://www.w3.org/2000/svg"
  height="288"
  preserveAspectRatio="xMidYMid"
  viewBox="0 0 256 288"
  width="50"
>
  <path
    d="m255.569 84.452376c-.002-4.83-1.035-9.098-3.124-12.761-2.052-3.602-5.125-6.621-9.247-9.008-34.025-19.619-68.083-39.178-102.097-58.81699995-9.17-5.294-18.061-5.101-27.163.269-13.543 7.98699995-81.348 46.83399995-101.553 58.53699995-8.321 4.817-12.37 12.189-12.372 21.771-.013 39.455 0 78.909-.013 118.365 0 4.724.991 8.909 2.988 12.517 2.053 3.711 5.169 6.813 9.386 9.254 20.206 11.703 88.02 50.547 101.56 58.536 9.106 5.373 17.997 5.565 27.17.269 34.015-19.64 68.075-39.198 102.105-58.817 4.217-2.44 7.333-5.544 9.386-9.252 1.994-3.608 2.987-7.793 2.987-12.518 0 0 0-78.889-.013-118.345"
    fill="#a179dc"
  />
  <path
    d="m128.182 143.241376-125.194 72.084c2.053 3.711 5.169 6.813 9.386 9.254 20.206 11.703 88.02 50.547 101.56 58.536 9.106 5.373 17.997 5.565 27.17.269 34.015-19.64 68.075-39.198 102.105-58.817 4.217-2.44 7.333-5.544 9.386-9.252z"
    fill="#280068"
  />
  <path
    d="m255.569 84.452376c-.002-4.83-1.035-9.098-3.124-12.761l-124.263 71.55 124.413 72.074c1.994-3.608 2.985-7.793 2.987-12.518 0 0 0-78.889-.013-118.345"
    fill="#390091"
  />
  <g fill="#fff">
    <path
      d="m201.892326 116.294008v13.473684h13.473684v-13.473684h6.736842v13.473684h13.473685v6.736842h-13.473685v13.473684h13.473685v6.736842h-13.473685v13.473684h-6.736842v-13.473684h-13.473684v13.473684h-6.736842v-13.473684h-13.473684v-6.736842h13.473684v-13.473684h-13.473684v-6.736842h13.473684v-13.473684zm13.473684 20.210526h-13.473684v13.473684h13.473684z"
    />
    <path
      d="m128.456752 48.625876c35.143771 0 65.827133 19.0862981 82.26181 47.4560675l-.16037-.2730675-41.348577 23.808283c-8.146656-13.793605-23.081479-23.1020873-40.213232-23.2937868l-.539631-.0030178c-26.125574 0-47.3060815 21.1793886-47.3060815 47.3049616 0 8.543615 2.2777748 16.552204 6.2389764 23.469476 8.1540981 14.235253 23.4829071 23.836606 41.0671051 23.836606 17.69277 0 33.108884-9.723357 41.221568-24.110835l-.197128.345313 41.286486 23.918037c-16.254398 28.129557-46.517408 47.156948-81.252701 47.536189l-1.058225.005774c-35.2545819 0-66.0252492-19.203824-82.4185122-47.72358-8.0029927-13.922969-12.5820476-30.064389-12.5820476-47.27698 0-52.4660524 42.5322682-94.99944 95.0005598-94.99944z"
    />
  </g>
</svg>`,
    bgColor: "bg-[#005A9C]",
    desc: "C# is a modern, object-oriented, and type-safe programming language known for its clean syntax and strong performance.",
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
  JavaScript: {
    name: "JavaScript",
    editorName: "javascript",
    emoji: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="100" viewBox="0 0 48 48">
<path fill="#ffd600" d="M6,42V6h36v36H6z"></path><path fill="#000001" d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506.906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"></path>
</svg>`,
    bgColor: "bg-orange-500",
    desc: "JavaScript is a versatile, high-level programming language primarily used for web development.",
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

  if (currentLanguage === "C++") {
    currentLanguage = "Cpp"
  } else if (currentLanguage === "C#") {
    currentLanguage = "Csharp"
  }
  
  console.log(currentLanguage)
  quizData[currentLanguage].subcategories.forEach((subcategory) => {
    console.log(subcategory)
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
      { className: "text-4xl font-bold mb-12 text-center text-[#f12b18]" },
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
      { className: "text-4xl font-bold mb-12 text-center text-[#f12b18]" },
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
  let selectedLevel = 1;

  const levelButtons = levels.map((level) =>
    createElement(
      "button",
      {
        className: `w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
          level === selectedLevel
            ? "bg-[#f12b18] text-white"
            : "bg-gray-700 text-gray-300"
        } hover:text-white transition-colors focus:bg-[#f12b18]`,
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
          ? "bg-[#f12b18] text-white"
          : "bg-gray-700 text-gray-300"
      } hover:text-white transition-colors focus:bg-[#f12b18]`;
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
      { className: "text-3xl font-bold mb-6 text-[#f12b18]" },
      `${category}`
    ),
    createElement(
      "p",
      { className: "mb-4 text-xl text-white" },
      "Select a Level:"
    ),
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
      className: "text-center py-4 text-white",
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
    console.log(timeLeft)
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
  const currentQuestion = levelQuestions[questionIndex];
  const correctAnswer = currentQuestion.correctAnswer;

  mainContent.innerHTML = "";
  mainContent.appendChild(
    QuizQuestion({
      question: currentQuestion.question,
      options: currentQuestion.options,
      onAnswer: () => {},
      timeLeft: timeLeft,
      questionNumber: questionIndex + 1,
      totalQuestions: levelQuestions.length,
      correctAnswer: correctAnswer,
      selectedAnswer: answer,
    })
  );

  addBackButton(() => {
    clearInterval(timer);
    showLevelSelection();
  });

  if (answer === levelQuestions[questionIndex].correctAnswer) {
    score++;
  }
  setTimeout(() => {
    questionIndex++;
    showQuestion();
  }, 2000);
}

function updateTimerDisplay() {
  const timerElement = mainContent.getElementsByClassName("time")[0];
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
        { className: "text-3xl font-bold mb-6 text-red-600" },
        "Quiz Complete!"
      ),
      createElement(
        "p",
        { className: "text-2xl mb-6 text-white" },
        `Your score: ${score}/${questions[currentLanguage][currentCategory][currentLevel].length}`
      ),
      createElement(
        "button",
        {
          className:
            "bg-secondary text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-red-600/80 transition-colors mr-4",
          onClick: () => startQuiz(currentLevel),
        },
        "Play Again"
      ),
      createElement(
        "button",
        {
          className:
            "bg-gray-700 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-gtay-700/80 transition-colors",
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
  const languageMap = {
    "Python" : "python_score",
    "Java" : "java_score",
    "C" : "c_score",
    "Cpp" : "cpp_score",
    "Csharp" : "csharp_score",
    "JavaScript" : "js_score",
  }
  const dbLanguage = languageMap[currentLanguage]
  const dbCategory = currentCategory.toLowerCase()

  console.log("updatascore:", dbLanguage, dbCategory)

  fetch("/update_score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score: score, language: dbLanguage, category: dbCategory }),
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

showLanguageSelection();