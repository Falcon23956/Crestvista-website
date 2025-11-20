const DATA_PATH = 'listings.json';
let properties = [];

function fetchData(){
  return fetch(DATA_PATH).then(r=>r.json()).then(j=>j.listings);
}

function renderGrid(list){
  const grid = document.getElementById('grid');
  grid.innerHTML='';
  list.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<img src="${p.image}" alt=""><div style="padding:12px"><h3>${p.title}</h3><div>${p.location}</div><div class="price">${typeof p.price==='number'? 'KES ' + p.price.toLocaleString(): p.price}</div><p style="margin-top:8px">${p.beds? p.beds+' beds':''}</p><button class="btn outline" data-id="${p.id}">View</button></div>`;
    grid.appendChild(card);
  });
  // attach view handlers
  document.querySelectorAll('.card button').forEach(b=>b.addEventListener('click', e=>openDetail(e.target.dataset.id)));
}

function openDetail(id){
  const p = properties.find(x=>x.id===id);
  const modal = document.getElementById('detailModal');
  const content = document.getElementById('detailContent');
  content.innerHTML = `<h2>${p.title}</h2><img src="${p.image}" style="width:100%;height:300px;object-fit:cover;border-radius:8px"><p style="margin-top:8px">${p.description}</p><p><strong>Location:</strong> ${p.location}</p><p><strong>Price:</strong> ${typeof p.price==='number'? 'KES ' + p.price.toLocaleString(): p.price}</p><p><strong>Beds:</strong> ${p.beds||'N/A'}</p>`;
  modal.setAttribute('aria-hidden','false');
}

function closeDetail(){ document.getElementById('detailModal').setAttribute('aria-hidden','true'); }

// search & filter
function applyFilters(){
  const q = document.getElementById('searchInput').value.toLowerCase();
  const beds = document.getElementById('bedsFilter').value;
  const min = parseFloat(document.getElementById('minPrice').value) || 0;
  const max = parseFloat(document.getElementById('maxPrice').value) || Infinity;
  let filtered = properties.filter(p=> (p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)) );
  if(beds) filtered = filtered.filter(p=> String(p.beds)===beds);
  filtered = filtered.filter(p=> {
    const price = typeof p.price==='number'? p.price : parseFloat(String(p.price).replace(/[^0-9.-]+/g,"")) || 0;
    return price>=min && price<=max;
  });
  renderGrid(filtered);
}

// admin: save to localStorage, export/import
function saveListing(obj){
  const idx = properties.findIndex(x=>x.id===obj.id);
  if(idx>-1) properties[idx]=obj; else properties.push(obj);
  localStorage.setItem('crest_listings', JSON.stringify(properties));
  renderGrid(properties);
  alert('Saved locally. Use Export JSON to get a file you can replace in repo.');
}

function exportJSON(){
  const blob = new Blob([JSON.stringify({listings:properties},null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='listings.json'; a.click();
  URL.revokeObjectURL(url);
}

function importJSON(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const j = JSON.parse(reader.result);
      if(Array.isArray(j.listings)){ properties = j.listings; localStorage.setItem('crest_listings', JSON.stringify(properties)); renderGrid(properties); alert('Imported'); }
    }catch(e){ alert('Invalid JSON'); }
  };
  reader.readAsText(file);
}

// theme toggle
function toggleTheme(){
  document.body.classList.toggle('dark');
  localStorage.setItem('crest_theme', document.body.classList.contains('dark')?'dark':'light');
}

document.addEventListener('DOMContentLoaded', async ()=>{
  // load initial data: localStorage overrides file
  const local = localStorage.getItem('crest_listings');
  if(local){ properties = JSON.parse(local); } else { properties = await fetchData(); }
  renderGrid(properties);

  // attach handlers
  document.getElementById('applyFilters').addEventListener('click', applyFilters);
  document.getElementById('clearFilters').addEventListener('click', ()=>{ document.getElementById('searchInput').value=''; document.getElementById('minPrice').value=''; document.getElementById('maxPrice').value=''; document.getElementById('bedsFilter').value=''; renderGrid(properties); });

  document.getElementById('closeDetail').addEventListener('click', closeDetail);
  document.getElementById('adminForm').addEventListener('submit', e=>{ e.preventDefault(); const obj={ id: document.getElementById('adm_id').value || ('p'+(Date.now()%10000)), title: document.getElementById('adm_title').value, location: document.getElementById('adm_location').value, price: isNaN(Number(document.getElementById('adm_price').value))?document.getElementById('adm_price').value:Number(document.getElementById('adm_price').value), beds: Number(document.getElementById('adm_beds').value)||0, image: document.getElementById('adm_image').value || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', description: document.getElementById('adm_desc').value }; saveListing(obj); });

  document.getElementById('exportBtn').addEventListener('click', exportJSON);
  document.getElementById('importFile').addEventListener('change', e=>importJSON(e.target.files[0]));

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  // apply saved theme
  if(localStorage.getItem('crest_theme')==='dark') document.body.classList.add('dark');
});
