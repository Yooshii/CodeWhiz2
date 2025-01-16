import { Terminal } from "https://cdn.jsdelivr.net/npm/xterm@5.1.0/+esm";

require.config({
  paths: { vs: "https://unpkg.com/monaco-editor@0.33.0/min/vs" },
});

require(["vs/editor/editor.main"], function () {
  const editor = monaco.editor.create(document.getElementById("editor"), {
    value: `# Your Python code here\nimport numpy as np\n\narray = np.array([1, 2, 3])\nprint(array)`,
    language: "python",
    theme: "vs-dark",
  });

  const runBtn = document.getElementById("runbtn");
  const term = new Terminal();
  term.open(document.getElementById("terminal"));

  function extractPackages(code) {
    const importRegex = /(?:import|from)\s+([a-zA-Z0-9_]+)/g;
    const packages = new Set();
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      packages.add(match[1]);
    }
    return Array.from(packages);
  }

  // Initialize Pyodide
  async function initializePyodide() {
    if (!window.loadPyodide) {
      throw new Error(
        "Pyodide script is not loaded. Please ensure pyodide.js is included before this script."
      );
    }

    let pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/",
    });

    // Load the 'sys' module
    await pyodide.loadPackage(["micropip"]);

    // Override sys.stdout and sys.stderr to capture output
    await pyodide.runPythonAsync(`
        import sys
        import io
        sys.stdout = io.StringIO()
        sys.stderr = io.StringIO()
      `);

    term.write("Terminal initialized successfully!");
    return pyodide;
  }

  let pyodideInstance = null;

  // Initialize Pyodide as soon as the page loads
  initializePyodide()
    .then((pyodide) => {
      pyodideInstance = pyodide;
    })
    .catch((error) => {
      console.error("Failed to initialize Pyodide:", error);
    });

  // Run button event listener
  runBtn.addEventListener("click", async () => {
    if (!pyodideInstance) {
      term.write("Pyodide is still loading...\r\n");
      return;
    }

    const code = editor.getValue();

    try {
      const packages = extractPackages(code);
      console.log("Detected packages:", packages);

      // Load required packages
      for (const pkg of packages) {
        try {
          await pyodideInstance.loadPackage(pkg);
          term.write(`Successfully loaded package: ${pkg}`);
        } catch (error) {
          term.write(`Failed to load package: ${pkg}`, error);
        }
      }

      // Run the command in Pyodide
      await pyodideInstance.runPythonAsync(code);

      // Capture stdout and stderr
      let stdout = await pyodideInstance.runPythonAsync(
        "sys.stdout.getvalue()"
      );
      let stderr = await pyodideInstance.runPythonAsync(
        "sys.stderr.getvalue()"
      );

      term.reset();

      // Display the output in the terminal
      term.write("\r" + stdout.replace(/\n/g, "\r\n"));
      stdout = "";
      if (stderr) {
        term.write(`\r\nError: ${stderr.replace(/\n/g, '\r\n')}`);
        stderr = "";
      }
    } catch (error) {
      term.write(`\r\nError: ${error}\r\n`);
    }
  });
});
