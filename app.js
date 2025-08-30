const apiKey = "d56799b4cbf445a1a3c0ccb99b4199a1";
const baseUrl = `https://newsapi.org/v2`;

const newsContainer = document.getElementById("news-container");
const toggleBtn = document.getElementById("themeToggle");
const newsHeading = document.getElementById("news-heading");
const icons = document.querySelectorAll(".header-center .icon");

async function fetchNews(category = "") {
  try {
    let url = `${baseUrl}/top-headlines?language=en&apiKey=${apiKey}`;
    let heading = "Top Headlines";

    if (category) {
      url = `${baseUrl}/top-headlines?language=en&category=${category}&apiKey=${apiKey}`;
      heading = category.charAt(0).toUpperCase() + category.slice(1);
    }

    newsHeading.textContent = heading;

    const res = await fetch(url);
    const data = await res.json();

    newsContainer.innerHTML = "";
    data.articles.forEach((article) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
      
        <img src="${article.urlToImage}" alt="${article.title}">
        <h3>${article.title}</h3>
        
        
        <a href="${article.url}" target="_blank" class="read-more">Read more</a>
      `;

      card.addEventListener("click", (e) => {
        // agar Read more link pe click ho raha hai to card click ignore karo
        if (e.target.classList.contains("read-more")) return;

        localStorage.setItem("selectedArticle", JSON.stringify(article));

        window.open("news-detail.html", "_blank");
      });
      newsContainer.appendChild(card);
    });
  } catch (error) {
    newsContainer.innerHTML = "<p>Error loading news</p>";
  }
}
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    toggleBtn.textContent = "🔆";
  } else {
    toggleBtn.textContent = "🌙";
  }
});

icons.forEach((btn) => {
  btn.addEventListener("click", () => {
    icons.forEach((icon) => icon.classList.remove("active"));

    btn.classList.add("active");

    const category = btn.dataset.category;
    fetchNews(category);
  });
});

fetchNews();

document.addEventListener("DOMContentLoaded", () => {
  // check karo ke current page detail wala hai
  if (window.location.pathname.includes("news-detail.html")) {
    const container = document.getElementById("news-detail");

    if (container) {
      const article = JSON.parse(localStorage.getItem("selectedArticle"));
      if (article) {
        container.innerHTML = `
      <h1>${article.title}</h1>
      <img src="${article.urlToImage || ""}" alt="${article.title}" />
      <h3>${article.description || ""}</h3>
      <p>${article.content || ""}</p>
      <a href="${article.url}" target="_blank">Read full article</a>
    `;
      } else {
        container.innerHTML = "<p>No article selected</p>";
      }
    }
  }
});

const backToTopBtn = document.getElementById("backToTop");

// scroll hone par button show/hide karna
window.addEventListener("scroll", () => {
  if (window.scrollY > 800) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

// button click par smooth scroll to top
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
