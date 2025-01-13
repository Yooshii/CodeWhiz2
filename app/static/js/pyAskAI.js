async function askAI() {
  const question = document.getElementById("claudeQuestion").value;
  const responseDiv = document.getElementById("claudeResponse");

  responseDiv.textContent = "Generating code... (May take a few minutes)";

  try {
    const response = await fetch("/py_question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();

    const escapedResponse = data.answer
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    let formattedResponse = escapedResponse
      .replace(/```([\s\S]*?)```/g, (match, codeContent) => {
        codeContent = codeContent.trim();

        return `<pre class="code-block"><code>${codeContent}</code></pre>`;
      })
      .replace(/`([\s\S]*?)`/g, (match, codeContent) => {
        codeContent = codeContent.trim();

        return `<b class="text-white">\`${codeContent}\`</b>`;
      });

    const blocks = formattedResponse.split(
      /(<pre class="code-block">.*?<\/pre>)/gs
    );

    const formattedBlocks = blocks.map((block) => {
      if (block.startsWith("<pre class=")) {
        return block;
      } else {
        return block.replace(/\n/g, "<br>");
      }
    });

    formattedResponse = formattedBlocks.join("");

    responseDiv.innerHTML = formattedResponse;

    const codeBlocks = document.querySelectorAll(".code-block code");

    codeBlocks.forEach((block) => {
      hljs.highlightBlock(block);
    });
  } catch (error) {
    console.error("Error fetching response:", error);
    responseDiv.textContent = "Error fetching response. Please try again.";
  }
}
