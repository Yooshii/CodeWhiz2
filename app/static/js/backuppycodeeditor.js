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

// async function runCode() {
//   const code = editor.getValue();
//   const output = document.getElementById("output");

//   const pyodide = await loadPyodide();
//   const regex = /import\s+(\w+)/g;
//   let matches;
//   let results = [];
//   await pyodide.loadPackage("micropip");

//   while ((matches = regex.exec(code)) !== null) {
//     results.push(
//       `pyodide.loadPackage("${matches[1]}")
// await pyodide.pyimport("${matches[1]}")');`
//     );
//   }
//   results.join("\n");

//   output.innerHTML = "";

//   const existingPyScript = document.querySelector(
//     'script[type="py"][terminal]'
//   );
//   const existingPyTerminal = document.querySelector("py-terminal");
//   if (existingPyScript) {
//     existingPyScript.remove();
//     existingPyTerminal.remove();
//   }

//   const pyScript = document.createElement("script");
//   pyScript.type = "py";
//   pyScript.setAttribute("terminal", "");
//   pyScript.innerHTML = code;

//   const editorDiv = document.getElementById("editor");
//   editorDiv.parentNode.insertBefore(pyScript, editorDiv.nextSibling);

//   const result = document.querySelector("output");
//   if (result) {
//     output.innerHTML = result.innerHTML;
//   }
// }

async function runCode() {
  const code = editor.getValue();
  const output = document.getElementById("output");

  try {
    // const pyodide = await loadPyodide();
    // await pyodide.loadPackage("micropip");

    // // Extract imports using regex
    // const importRegex = /import\s+(\w+)|from\s+(\w+)\s+import/g;
    // const matches = [...code.matchAll(importRegex)];

    // // Load all required packages before running the code
    // for (const match of matches) {
    //   const package_name = match[1] || match[2];
    //   try {
    //     console.log(`Loading package: ${package_name}`);
    //     // Load the package using loadPackage
    //     await pyodide.loadPackage(package_name.toLowerCase());
    //   } catch (err) {
    //     console.warn(`Warning: Could not load package ${package_name}:`, err);
    //   }
    // }

    // Clear existing terminal

    const code = editor.getValue();
    const output = document.getElementById("output");

    const regex = /import\s+(\w+)/g;
    let matches;
    let results = [];

    while ((matches = regex.exec(code)) !== null) {
      results.push(`"${matches[1]}"`);
    }

    // const existingPyConfig = document.querySelector("py-config");
    const existingPyScript = document.querySelector(
      'script[type="py"][terminal][worker]'
    );
    const existingPyTerminal = document.querySelector("py-terminal");

    if (existingPyConfig) {
      existingPyScript.remove();
    }

    // // Create new terminal elements
    // const pyConfig = document.createElement("py-config");
    // pyConfig.innerHTML = `
    // {
    //   "packages" : [${results.join(", ")}]
    // }`;

    // document.body.appendChild(pyConfig);

    if (existingPyScript) {
      existingPyScript.remove();
    }
    if (existingPyTerminal) {
      existingPyTerminal.remove();
    }

    // Create new terminal elements
    const pyScript = document.createElement("script");
    pyScript.type = "py";
    pyScript.setAttribute("terminal", "");
    pyScript.setAttribute("worker", "");
    pyScript.innerHTML = code;

    // Add terminal to the page
    const editorDiv = document.getElementById("editor");
    editorDiv.parentNode.insertBefore(pyScript, editorDiv.nextSibling);

    const result = document.querySelector("output");
    if (result) {
      output.innerHTML = result.innerHTML;
    }

    try {
      const result = await pyodide.runPythonAsync(code);

      // Wait a brief moment for the terminal to update
      setTimeout(() => {
        const terminalOutput = document.querySelector("py-terminal");
        if (terminalOutput) {
          output.innerHTML = terminalOutput.innerHTML;
        } else if (result !== undefined) {
          output.innerHTML = String(result);
        }
      }, 100);

    } catch (err) {
      output.innerHTML = `Error: ${err.message}`;
      console.error("Python execution error:", err);
    }
  } catch (err) {
    output.innerHTML = `System Error: ${err.message}`;
    console.error("System error:", err);
  }
}