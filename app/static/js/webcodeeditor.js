require.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs",
    },
  });
  require(["vs/editor/editor.main"], function () {
    const htmlEditor = monaco.editor.create(
      document.getElementById("htmlEditor"),
      {
        value: `<!-- HTML -->`,
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
  
    function runCode() {
      let htmlCode = htmlEditor.getValue();
      let cssCode = cssEditor.getValue();
      let jsCode = jsEditor.getValue();
  
      let output = document.getElementById("output");
  
      output.contentDocument.body.innerHTML =
        htmlCode + "<style>" + cssCode + "</style>";
  
      output.contentWindow.eval(jsCode);
    }
    document.getElementById("runbtn").onclick = runCode;
  });
  
  window.addEventListener("scroll", function () {
    var nav = document.querySelector("nav");
    nav.classList.toggle("sticky", window.scrollY > 0);
  });
  