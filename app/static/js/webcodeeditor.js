require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {
  const htmlEditor = monaco.editor.create(
    document.getElementById("htmlEditor"),
    {
      value: `<!-- HTML -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Document</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body>
  <h1>hello world</h1>
</body>
</html>`,
      language: "html",
      theme: "vs-dark",
    }
  );

  const cssEditor = monaco.editor.create(document.getElementById("cssEditor"), {
    value: `/* CSS */`,
    language: "css",
    theme: "vs-dark",
  });

  const jsEditor = monaco.editor.create(document.getElementById("jsEditor"), {
    value: `// JS`,
    language: "javascript",
    theme: "vs-dark",
  });

  runBtn = document.getElementById("runbtn")
  runBtn.addEventListener("click", () => {
    let htmlCode = htmlEditor.getValue();
    let cssCode = cssEditor.getValue();
    let jsCode = jsEditor.getValue();

    let output = document.getElementById("output");

    output.contentDocument.body.innerHTML =
      htmlCode + "<style>" + cssCode + "</style>";

    output.contentWindow.eval(jsCode);
  })
});

// Function to open a file
function openFile(type) {
  const htmlEditor = document.getElementById("htmlEditor");
  const htmlbtn = document.getElementById("htmlbtn");
  const cssEditor = document.getElementById("cssEditor");
  const cssbtn = document.getElementById("cssbtn");
  const jsEditor = document.getElementById("jsEditor");
  const jsbtn = document.getElementById("jsbtn");
  const output = document.getElementById("output");
  const outputbtn = document.getElementById("outputbtn");
  const agent = document.getElementById("agent");
  const agentbtn = document.getElementById("agentbtn");

  const btnclasson = ["bg-[#25292e]", "text-white"];
  const btnclassoff = [
    "bg-[#1e1e1e]",
    "text-gray-400",
    "hover:bg-[#25292e]",
    "hover:text-white",
  ];

  if (type === "html") {
    htmlEditor.classList.remove("hidden");
    htmlbtn.classList.remove(...btnclassoff);
    htmlbtn.classList.add(...btnclasson);

    cssEditor.classList.add("hidden");
    cssbtn.classList.add(...btnclassoff);
    cssbtn.classList.remove(...btnclasson);

    jsEditor.classList.add("hidden");
    jsbtn.classList.add(...btnclassoff);
    jsbtn.classList.remove(...btnclasson);
  } else if (type === "css") {
    cssEditor.classList.remove("hidden");
    cssbtn.classList.remove(...btnclassoff);
    cssbtn.classList.add(...btnclasson);

    htmlEditor.classList.add("hidden");
    htmlbtn.classList.add(...btnclassoff);
    htmlbtn.classList.remove(...btnclasson);

    jsEditor.classList.add("hidden");
    jsbtn.classList.add(...btnclassoff);
    jsbtn.classList.remove(...btnclasson);
  } else if (type === "js") {
    jsEditor.classList.remove("hidden");
    jsbtn.classList.remove(...btnclassoff);
    jsbtn.classList.add(...btnclasson);

    htmlEditor.classList.add("hidden");
    htmlbtn.classList.add(...btnclassoff);
    htmlbtn.classList.remove(...btnclasson);

    cssEditor.classList.add("hidden");
    cssbtn.classList.add(...btnclassoff);
    cssbtn.classList.remove(...btnclasson);
  } else if (type === "output") {
    output.classList.remove("hidden");
    outputbtn.classList.remove(...btnclassoff);
    outputbtn.classList.add(...btnclasson);

    agent.classList.add("hidden");
    agentbtn.classList.add(...btnclassoff);
    agentbtn.classList.remove(...btnclasson);
  } else if (type === "agent") {
    agent.classList.remove("hidden");
    agentbtn.classList.remove(...btnclassoff);
    agentbtn.classList.add(...btnclasson);
    
    output.classList.add("hidden");
    outputbtn.classList.add(...btnclassoff);
    outputbtn.classList.remove(...btnclasson);
  }
}
