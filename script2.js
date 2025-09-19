const container = document.getElementById('newsContainer');
let index = 0;

// Fetch 10 articles from GNews API
let apikey = '5d5d8566e37647ab7cf5bb58ed594509';
let url = `https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&token=${apikey}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    let articles = data.articles;

    // Clear the container in case of previous content
    container.innerHTML = '';

    // Dynamically add each article
    articles.forEach((article, i) => {
      const articleDiv = document.createElement('div');
      articleDiv.className = 'news-article';
      articleDiv.innerHTML = `
        <h2>${article.title}</h2>
        <img src="${article.image}" alt="Article Image" style="width:100%; height:60%; ;        " />
        <p>${article.description}</p>
      `;
      container.appendChild(articleDiv);
    });
  });

// Auto-slide every 10 seconds
setInterval(() => {
  const totalArticles = container.children.length;
  index = (index + 1) % totalArticles;
  container.style.transform = `translateX(-${index * 100}%)`;
}, 5000);
