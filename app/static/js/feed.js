function createPost() {
  const postsContent = document.getElementById("postContent").value;

  if (postsContent.value != "") {
    fetch("/create_post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: postsContent }),
    }).then((response) => {
      if (response.ok) {
        fetchPosts();
        document.getElementById("postContent").value = "";
      } else {
        console.alert("Error creating post");
      }
    });
  }
}

function fetchPosts() {
  fetch("/get_posts")
    .then((response) => response.json())
    .then((posts) => {
      const postsContainer = document.getElementById("postsContainer");
      postsContainer.innerHTML = "";
      console.log(posts);
      posts["posts"].forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className = "bg-gray-800 shadow-md rounded-lg p-4";

        const postHeader = document.createElement("div");
        postHeader.className = "flex justify-between items-center mb-2";

        const userName = document.createElement("span");
        userName.className = "text-lg font-semibold text-gray-200";
        userName.textContent = `@${post.author_username}`;

        const postTimestamp = document.createElement("span");
        postTimestamp.className = "text-sm text-gray-400";
        postTimestamp.textContent = new Date(post.timestamp).toLocaleString();

        postHeader.appendChild(userName);
        postHeader.appendChild(postTimestamp);

        const postContent = document.createElement("p");
        postContent.className = "text-gray-200 mt-2";
        postContent.textContent = post.content;

        postElement.appendChild(postHeader);
        postElement.appendChild(postContent);

        postsContainer.appendChild(postElement);
      });
    });
}

fetchPosts();
