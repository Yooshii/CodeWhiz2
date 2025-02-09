function openFile(type) {
  const pythonEditor = document.getElementById("pythonEditor");
  const pyeditorbtn = document.getElementById("pyeditorbtn");
  const terminal = document.getElementById("terminal");
  const terminalbtn = document.getElementById("terminalbtn");
  const agent = document.getElementById("agent");
  const agentbtn = document.getElementById("agentbtn");

  const btnclasson = ["bg-[#25292e]", "text-white"];
  const btnclassoff = [
    "bg-[#1e1e1e]",
    "text-gray-400",
    "hover:bg-[#25292e]",
    "hover:text-white",
  ];

  if (type === "python") {
    pythonEditor.classList.remove("hidden");
  } else if (type === "terminal") {
    terminal.classList.remove("hidden");
    terminalbtn.classList.remove(...btnclassoff);
    terminalbtn.classList.add(...btnclasson);
    agent.classList.add("hidden");
    agentbtn.classList.add(...btnclassoff);
    agentbtn.classList.remove(...btnclasson);
  } else if (type === "agent") {
    agent.classList.remove("hidden");
    agentbtn.classList.remove(...btnclassoff);
    agentbtn.classList.add(...btnclasson);
    terminal.classList.add("hidden");
    terminalbtn.classList.add(...btnclassoff);
    terminalbtn.classList.remove(...btnclasson);
  }
}
