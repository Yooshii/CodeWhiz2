let editor;

require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: `# Python
# No installing, importing modules`,
    language: "python",
    theme: "vs-dark",
  });
});

async function runCode() {
  code = editor.getValue();
  output = document.getElementById("output");
  output.textContent = ""

  const response = await fetch("/run_py", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: code }),
  })
  const data = await response.json()

  if (data.error) {
    output.textContent = data.error;
  }
  else {
    output.textContent = data.output
  }
}