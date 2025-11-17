async function loadResources() {
  const res = await fetch('data/resources.json');
  const resources = await res.json();
  const list = document.getElementById('resource-list');
  const featuredEl = document.getElementById('featured');

  // render function that applies search + category filters
  function renderList() {
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter-category');
    const term = searchInput ? searchInput.value.toLowerCase() : '';
    const category = filterSelect ? filterSelect.value : '';

    const filtered = resources.filter(r => {
      const matchesTerm = term === '' || r.name.toLowerCase().includes(term) || r.category.toLowerCase().includes(term);
      const matchesCategory = !category || r.category === category;
      return matchesTerm && matchesCategory;
    });

    // render resource cards
    list.innerHTML = `<div class="cards">` + filtered.map(r => `
      <article class="card">
        <div class="card-media">
          ${r.image ? `<img src="${r.image}" alt="${r.name}">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#2E8B57;font-weight:700">${(r.name||'').split(' ').map(w=>w[0]).slice(0,2).join('')}</div>`}
        </div>
        <div class="card-body">
          <h3>${r.name}</h3>
          <div class="card-category">${r.category}</div>
          <p>${r.description ? r.description : ''}</p>
        </div>
        <div class="card-footer">
          <a class="view-link" href="${r.link}" target="_blank">VIEW RESOURCE</a>
        </div>
      </article>
    `).join('') + `</div>`;

    // featured (first 3) as cards
    if (featuredEl) {
      featuredEl.innerHTML = `<div class="featured-cards">` + resources.slice(0, 3).map(r => `
        <article class="card">
          <div class="card-media">
            ${r.image ? `<img src="${r.image}" alt="${r.name}">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#2E8B57;font-weight:700">${(r.name||'').split(' ').map(w=>w[0]).slice(0,2).join('')}</div>`}
          </div>
          <div class="card-body">
            <h3>${r.name}</h3>
            <div class="card-category">${r.category}</div>
            <p>${r.description ? r.description : ''}</p>
          </div>
          <div class="card-footer">
            <a class="view-link" href="${r.link}" target="_blank">VIEW RESOURCE</a>
          </div>
        </article>
      `).join('') + `</div>`;
    }
  }

  // initial render
  renderList();

  // wire up search and category controls if present
  const searchInput = document.getElementById('search');
  if (searchInput) searchInput.addEventListener('input', renderList);
  const filterSelect = document.getElementById('filter-category');
  if (filterSelect) filterSelect.addEventListener('change', renderList);
  // wire up explicit search button if present
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) searchBtn.addEventListener('click', (e) => { e.preventDefault(); renderList(); });
}

// Only attach the search listener if the search input exists
// (pages like about.html include the search box; others do not)
// The search setup lives inside loadResources, but we guard adding listeners below.

// Attach a safe submit handler if the resource form exists on the page
const resourceForm = document.getElementById('resourceForm');
if (resourceForm) {
  resourceForm.addEventListener('submit', e => {
    e.preventDefault();
    const thank = document.getElementById('thankyou');
    if (thank) thank.textContent = 'Thank you! Your resource has been submitted.';
    e.target.reset();
  });
}

// Only load resources on pages that include the #resource-list element
if (document.getElementById('resource-list')) {
  loadResources();
}
