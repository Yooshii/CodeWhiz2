// // Initialize Monaco Editor
// require.config({
//   paths: { vs: "https://unpkg.com/monaco-editor@0.33.0/min/vs" },
// });

// require(["vs/editor/editor.main"], function () {
//   const editor = monaco.editor.create(document.getElementById("editor"), {
//     value: `# Your Python code here\nimport numpy as np\n\narray = np.array([1, 2, 3])\nprint(array)`,
//     language: "python",
//     theme: "vs-dark",
//   });

//   const runBtn = document.getElementById("runbtn");
//   const outputDiv = document.getElementById("output");

//   // Function to extract package names from import statements
//   function extractPackages(code) {
//     const importRegex = /(?:import|from)\s+([a-zA-Z0-9_]+)/g;
//     const packages = new Set();
//     let match;
//     while ((match = importRegex.exec(code)) !== null) {
//       packages.add(match[1]);
//     }
//     return Array.from(packages);
//   }

//   // Initialize Pyodide
//   async function initializePyodide() {
//     if (!window.loadPyodide) {
//       throw new Error(
//         "Pyodide script is not loaded. Please ensure pyodide.js is included before this script."
//       );
//     }

//     let pyodide = await loadPyodide({
//       indexURL: "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/",
//     });

//     // Load the 'sys' module
//     await pyodide.loadPackage(["micropip"]);

//     // Override sys.stdout and sys.stderr to capture output
//     await pyodide.runPythonAsync(`
//       import sys
//       import io
//       sys.stdout = io.StringIO()
//       sys.stderr = io.StringIO()
//     `);

//     console.log("Pyodide initialized successfully!");
//     return pyodide;
//   }

//   let pyodideInstance = null;

//   // Initialize Pyodide as soon as the page loads
//   initializePyodide()
//     .then((pyodide) => {
//       pyodideInstance = pyodide;
//     })
//     .catch((error) => {
//       console.error("Failed to initialize Pyodide:", error);
//     });

//   // Run button event listener
//   runBtn.addEventListener("click", async () => {
//     if (!pyodideInstance) {
//       outputDiv.textContent = "Pyodide is still loading...";
//       return;
//     }

//     const code = editor.getValue();
//     outputDiv.textContent = "";

//     try {
//       // Extract required packages
//       const packages = extractPackages(code);
//       console.log("Detected packages:", packages);

//       // Load required packages
//       for (const pkg of packages) {
//         try {
//           await pyodideInstance.loadPackage(pkg);
//           console.log(`Successfully loaded package: ${pkg}`);
//         } catch (error) {
//           console.warn(`Failed to load package: ${pkg}`, error);
//         }
//       }

//       // Run the user's code
//       await pyodideInstance.runPythonAsync(code);

//       // Capture stdout and stderr
//       const stdout = pyodideInstance.runPythonAsync(`
//         sys.stdout.getvalue()
//       `);
//       const stderr = pyodideInstance.runPythonAsync(`
//         sys.stderr.getvalue()
//       `);

//       // Display the output
//       outputDiv.classList.remove("text-red-600");
//       outputDiv.classList.add("text-white");
//       outputDiv.textContent = await stdout;
//       if (await stderr) {
//         outputDiv.classList.remove("text-white");
//         outputDiv.classList.add("text-red-600");
//         outputDiv.textContent += `\nError: ${await stderr}`;
//       }
//     } catch (error) {
//       outputDiv.classList.remove("text-white");
//       outputDiv.classList.add("text-red-600");
//       outputDiv.textContent = `Error: ${error}`;
//     }
//   });
// });

// // Function to ask AI (Claude)
// async function askAI() {
//   const question = document.getElementById("claudeQuestion").value;
//   const responseDiv = document.getElementById("claudeResponse");

//   responseDiv.textContent = "Generating code... (May take a few minutes)";

//   try {
//     const response = await fetch("/py_question", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ question }),
//     });
//     const data = await response.json();
//     console.log(data);
//     responseDiv.innerHTML = data.answer;
//   } catch (error) {
//     console.error("Error fetching response:", error);
//     responseDiv.textContent = "Error fetching response. Please try again.";
//   }
// }

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
