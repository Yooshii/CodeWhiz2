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
      console.log("Signup data", data)
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

window.addEventListener("scroll", function () {
  var nav = document.querySelector("nav");
  nav.classList.toggle("sticky", window.scrollY > 0);
});