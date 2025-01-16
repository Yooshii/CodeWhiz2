async function askAI() {
  const question = document.getElementById("claudeQuestion").value;
  const responseDiv = document.getElementById("claudeResponse");

  responseDiv.textContent = "Generating code... (May take a few minutes)";

  try {
    const response = await fetch("/web_question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();

    const matches = [...data.answer.matchAll(/```([\s\S]*?)```/g)];
    const firstWords = matches.map((match) => {
      const codeContent = match[1].trim();
      return codeContent.split(/\s+/)[0];
    });

    const escapedResponse = data.answer
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    let formattedResponse = escapedResponse;
    let matchIndex = 0;

    formattedResponse = formattedResponse.replace(
      /```([\s\S]*?)```/g,
      (match, codeContent) => {
        codeContent = codeContent.trim();
        const firstWord = firstWords[matchIndex];
        matchIndex++;
        return `<pre class="code-block"><code class="language-${firstWord.toLowerCase()}">${codeContent}</code></pre>`;
      }
    );

    formattedResponse = formattedResponse.replace(
      /`([\s\S]*?)`/g,
      (match, codeContent) => {
        codeContent = codeContent.trim();

        return `<b class="text-white">\`${codeContent}\`</b>`;
      }
    );

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
