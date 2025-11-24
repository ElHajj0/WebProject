// small escape helper
function escapeHtml(s) {
  if (!s && s !== 0) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// robust DOM-renderer: batches of n books, full DOM API
function renderProductsSimpleDOM(containerId, data, n = 5) {
  const root = document.getElementById(containerId);
  if (!root) {
    console.error('renderProductsSimpleDOM: root not found:', containerId);
    return;
  }
  root.innerHTML = ''; // reset

  // validate data shape
  if (!data || !Array.isArray(data.categories)) {
    console.error('renderProductsSimpleDOM: invalid data, expected { categories: [] }', data);
    root.textContent = 'Error: products data is invalid. See console.';
    return;
  }

  // flatten books
  const allBooks = data.categories.flatMap(cat => {
    if (!cat || !Array.isArray(cat.books)) return [];
    return cat.books;
  });

  if (allBooks.length === 0) {
    root.textContent = 'No books found in products.json';
    return;
  }

  console.log('renderProductsSimpleDOM: total books =', allBooks.length);

  let categoryIndex = 0;
  for (let i = 0; i < allBooks.length; i += n) {
    const categoryName = (data.categories[categoryIndex] && data.categories[categoryIndex].name) || `Category ${categoryIndex + 1}`;
    categoryIndex++;

    const titleBar = document.createElement('div');
    titleBar.className = 'title-bar';
    const titleInner = document.createElement('div');
    titleInner.className = 'title';
    titleInner.textContent = categoryName;
    titleBar.appendChild(titleInner);
    root.appendChild(titleBar);

    const bookContainer = document.createElement('div');
    bookContainer.className = 'book-container';
    root.appendChild(bookContainer);

    const slice = allBooks.slice(i, i + n);
    slice.forEach((book, idx) => {
      const imgSrc = book && book.image ? book.image : '';
      const title = book && book.title ? book.title : 'Untitled';
      const author = book && book.author ? book.author : 'Unknown';
      const price = book && book.price ? book.price : '';

      const card = document.createElement('div');
      card.className = 'book-card';

      // 🔥 NEW — IMAGE WRAPPER
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'book-image-container';

      const img = document.createElement('img');
      img.className = 'book-image';
      img.src = imgSrc || 
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="170"><rect width="100%" height="100%" fill="%23ddd"/></svg>';
      img.alt = escapeHtml(title) + ' Cover';

      img.addEventListener('error', () => {
        img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="170"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="12" fill="%23999">No image</text></svg>';
      });

      imgWrapper.appendChild(img);
      card.appendChild(imgWrapper);

      const t = document.createElement('div');
      t.className = 'book-title';
      t.textContent = title;
      card.appendChild(t);

      const a = document.createElement('div');
      a.className = 'book-author';
      a.textContent = author;
      card.appendChild(a);

      if (price) {
        const p = document.createElement('div');
        p.className = 'book-price';
        p.textContent = price;
        card.appendChild(p);
      }

      const btn = document.createElement('button');
      btn.className = 'add-to-cart';
      btn.type = 'button';
      btn.textContent = 'Add to Cart';
      btn.dataset.name = title;
      btn.dataset.price = (book && typeof book.priceValue === 'number')
        ? book.priceValue
        : (book && book.priceValue ? Number(book.priceValue) : 0);
      btn.dataset.image = imgSrc;

      btn.addEventListener('click', (e) => {
        const countEl = document.getElementById('cart-count');
        const current = Number(countEl.dataset.count || 0) + 1;
        countEl.dataset.count = current;
        countEl.textContent = 'Cart: ' + current;
        console.log('Add to cart clicked:', { name: btn.dataset.name, price: btn.dataset.price });
      });
      card.appendChild(btn);

      bookContainer.appendChild(card);
    });
  }

  console.log('renderProductsSimpleDOM: render finished.');
}

// fetch JSON and render
(function init() {
  fetch('products.json')
    .then(r => {
      if (!r.ok) throw new Error('Failed to fetch products.json: ' + r.status);
      return r.json();
    })
    .then(data => {
      console.log('products.json loaded', data);
      renderProductsSimpleDOM('product-list', data, 5);
    })
    .catch(err => {
      console.error('Error loading products.json:', err);
      const root = document.getElementById('product-list');
      if (root) root.textContent = 'Error loading products.json — check console.';
    });
})();

// select all category links
const categoryLinks = document.querySelectorAll('.category-links a');

categoryLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // prevent default jump

    const categoryName = link.dataset.category;
    if (!categoryName) return;

    // find the title-bar with the matching text
    const target = Array.from(document.querySelectorAll('.title-bar .title'))
                        .find(el => el.textContent.trim() === categoryName);

    if (target) {
      // get the top position of the element
      const topPos = target.getBoundingClientRect().top + window.scrollY;

      // adjust by offset (e.g., 50px up)
      const offset = 50;

      window.scrollTo({
        top: topPos - offset,
        behavior: 'smooth'
      });
    }
  });
});

let isToggled = false;
function toggleMenue(){
    if(isToggled){
        document.getElementById('navMenu').style.right = '-200%';
        isToggled = false;
    }else{
        document.getElementById('navMenu').style.right = '0';
        isToggled = true;
    }

    const header = document.querySelector('header');
    const navMenu = document.querySelector('#navMenu');
    const nav = document.querySelector('.navig');
    header.classList.toggle('active');
    nav.classList.toggle('active');
    navMenu.classList.toggle('active');
}
