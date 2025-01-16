const sidebar = document.getElementById("sidebar");
const sidebtn = document.getElementById("sidebtn");
const sidebtnline = document.getElementById("sidebtnline");
const mainContainer = document.getElementById("mainContainer");

function sidea() {
  sidebtnline.classList.remove("w-1/5");
  sidebtnline.classList.add("w-2/5");
}

function sideb() {
  sidebtnline.classList.remove("w-2/5");
  sidebtnline.classList.add("w-1/5");
}

sidebtn.addEventListener("mouseover", () => {
  if (sidebar.classList.contains("-translate-x-full")) {
    sidebtnline.classList.remove("w-1/5");
    sidebtnline.classList.add("w-2/5");
  } else {
    sidebtnline.classList.remove("w-2/5");
    sidebtnline.classList.add("w-1/5");
  }
});

sidebtn.addEventListener("mouseout", () => {
  if (sidebar.classList.contains("-translate-x-full")) {
    sidebtnline.classList.remove("w-2/5");
    sidebtnline.classList.add("w-1/5");
  } else {
    sidebtnline.classList.remove("w-1/5");
    sidebtnline.classList.add("w-2/5");
  }
});

sidebtn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
  sidebtnline.classList.toggle("bg-white");

  if (sidebar.classList.contains("-translate-x-full")) {
    mainContainer.classList.remove("sidebar-on");
    mainContainer.classList.add("w-full");
  } else {
    mainContainer.classList.remove("w-full");
    mainContainer.classList.add("sidebar-on");
  }
});
