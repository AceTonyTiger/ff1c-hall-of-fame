const trophy = `<svg viewBox="0 0 180 220" aria-hidden="true"><path d="M49 17h82l-8 49c-3 22-15 35-28 41v30h28v17H57v-17h28v-30C72 101 60 88 57 66L49 17Zm-7 12H20v23c0 27 14 42 40 46l-5-17c-12-4-18-12-18-28V29Zm96 0 5 24c0 16-6 24-18 28l-5 17c26-4 40-19 40-46V29h-22ZM63 189h54l12 14H51l12-14Z" fill="currentColor"/></svg>`;
const seasonFilter = document.querySelector('#season-filter');
const tierFilter = document.querySelector('#tier-filter');
const championshipList = document.querySelector('#championship-list');
const archiveList = document.querySelector('#archive-list');
const archiveSearch = document.querySelector('#archive-search');
let records = [];

function uniqueValues(key) { return [...new Set(records.map(record => Number(record[key])))].sort((a, b) => a - b); }
function badgeText(record) { return `SEASON ${record.season} <i>·</i> TIER ${record.tier}`; }
function renderStats() {
  const seasons = new Set(records.map(r => r.season)).size;
  const tiers = new Set(records.map(r => r.tier)).size;
  const stats = [
    [records.length, "DRIVERS' TITLES", 'drivers titles recorded'],
    [records.length, "CONSTRUCTORS' TITLES", 'constructors titles recorded'],
    [seasons, 'SEASONS', 'seasons represented'],
    [tiers, 'RACING TIERS', 'racing tiers represented']
  ];
  document.querySelector('#stats-grid').innerHTML = stats.map(([num, label, a11y]) => `<article class="stat"><strong>${num}<sup>+</sup></strong><span>${label}</span><span class="sr-only">${a11y}</span></article>`).join('');
}
function populateFilters() {
  uniqueValues('season').forEach(value => seasonFilter.insertAdjacentHTML('beforeend', `<option value="${value}">Season ${value}</option>`));
  uniqueValues('tier').forEach(value => tierFilter.insertAdjacentHTML('beforeend', `<option value="${value}">Tier ${value}</option>`));
}
function cardMarkup(record) {
  const teamClass = record.constructorsChampion.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `<article class="championship-group" data-season="${record.season}" data-tier="${record.tier}">
    <div class="group-heading"><span class="group-index">${String(record.season).padStart(2, '0')}<i> / </i>${String(record.tier).padStart(2, '0')}</span><span class="group-badge">${badgeText(record)}</span><span class="group-rule"></span></div>
    <div class="award-grid">
      <article class="award-card driver-card"><div class="card-topline"><span>DRIVERS' WORLD CHAMPION</span><span class="card-star">✦</span></div><img class="award-photo driver-award-photo" src="assets/trophies/drivers-world-championship.jpg" alt="Formula 1 World Drivers' Championship trophy" loading="lazy"><div class="winner-copy"><p class="winner-label">WORLD CHAMPION</p><h3>${escapeHTML(record.driversChampion)}</h3><span class="champion-callout">DRIVERS' TITLE HOLDER</span></div><div class="card-bottom"><span>${badgeText(record)}</span><span class="title-mark">FF1C <b>✦</b></span></div></article>
      <article class="award-card constructor-card team-${teamClass}"><div class="team-accent"></div><img class="award-photo constructor-award-photo" src="assets/trophies/constructors-world-championship.jpg" alt="Formula 1 World Constructors' Championship trophy" loading="lazy"><div class="card-topline"><span>CONSTRUCTORS' WORLD CHAMPION</span><span class="card-star">✦</span></div><div class="team-identity"><div class="team-crest" aria-label="${escapeHTML(record.constructorsChampion)} team emblem">${record.teamLogo ? `<img src="${escapeHTML(record.teamLogo)}" alt="${escapeHTML(record.constructorsChampion)} logo" loading="lazy">` : escapeHTML(record.constructorsChampion.split(/\s+/).map(w => w[0]).join('').slice(0, 2))}</div><div class="team-copy"><p class="winner-label">CONSTRUCTOR</p><h3>${escapeHTML(record.constructorsChampion)}</h3></div></div><div class="constructor-drivers"><span>CHAMPIONSHIP DRIVERS</span><div>${record.constructorDrivers.map(driver => `<b>${escapeHTML(driver)}</b>`).join('')}</div></div><div class="card-bottom"><span>${badgeText(record)}</span><span class="title-mark">TEAM <b>✦</b></span></div></article>
    </div>
  </article>`;
}
function renderChampionships() {
  const season = seasonFilter.value;
  const tier = tierFilter.value;
  const filtered = [...records].sort(sortRecent).filter(r => (season === 'all' || String(r.season) === season) && (tier === 'all' || String(r.tier) === tier));
  championshipList.innerHTML = filtered.map(cardMarkup).join('');
  document.querySelector('#result-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'CHAMPIONSHIP' : 'CHAMPIONSHIPS'}`;
  document.querySelector('#empty-state').hidden = filtered.length > 0;
}
function sortRecent(a, b) { return b.season - a.season || a.tier - b.tier; }
function archiveMarkup(record, index) {
  const drivers = record.constructorDrivers.map(escapeHTML).join(', ');
  return `<button type="button" class="archive-row" data-record="${index}"><span class="archive-season"><small>SEASON</small><b>${String(record.season).padStart(2, '0')}</b></span><span class="archive-tier">TIER ${record.tier}</span><span class="archive-driver"><small>DRIVERS' CHAMPION</small><b>${escapeHTML(record.driversChampion)}</b></span><span class="archive-constructor"><small>CONSTRUCTORS' CHAMPION</small><b>${escapeHTML(record.constructorsChampion)}</b></span><span class="archive-team-drivers"><small>TEAM DRIVERS</small><b>${drivers}</b></span><span class="archive-open" aria-hidden="true">↗</span></button>`;
}
function renderArchive() {
  const query = archiveSearch.value.trim().toLocaleLowerCase();
  const matches = records.map((record, index) => ({ record, index })).filter(({record}) => [record.driversChampion, record.constructorsChampion, ...record.constructorDrivers].some(name => name.toLocaleLowerCase().includes(query))).sort((a,b) => sortRecent(a.record,b.record));
  archiveList.innerHTML = matches.map(({record,index}) => archiveMarkup(record,index)).join('');
  document.querySelector('#archive-count').textContent = `${matches.length} ${matches.length === 1 ? 'RECORD' : 'RECORDS'}`;
  document.querySelector('#archive-empty').hidden = matches.length > 0;
}
function renderLegends() {
  const byDriver = new Map();
  records.forEach(record => {
    const entry = byDriver.get(record.driversChampion) || [];
    entry.push(record); byDriver.set(record.driversChampion, entry);
  });
  document.querySelector('#legends-grid').innerHTML = [...byDriver.entries()].map(([name, wins]) => `<article class="legend-card"><div class="legend-top"><span>FF1C LEGEND</span><span class="legend-count">${wins.length} ${wins.length === 1 ? 'TITLE' : 'TITLES'}</span></div><div class="legend-trophies">${wins.map(() => `<span>${trophy}</span>`).join('')}</div><h3>${escapeHTML(name)}</h3><p>Drivers' World Champion${wins.length > 1 ? ' × ' + wins.length : ''}</p><div class="legend-seasons">${wins.sort(sortRecent).map(r => `<span>${badgeText(r)}</span>`).join('')}</div></article>`).join('');
}
function showDetails(index) {
  const record = records[index];
  const dialog = document.querySelector('#details-dialog');
  document.querySelector('#dialog-content').innerHTML = `<p class="eyebrow">OFFICIAL FF1C RECORD · ${badgeText(record)}</p><h2 id="dialog-title">Championship <em>Details</em></h2><p class="dialog-description">${escapeHTML(record.seasonDescription || 'An official FF1C championship record.')}</p><div class="dialog-awards"><div><span>DRIVERS' WORLD CHAMPION</span><b>${escapeHTML(record.driversChampion)}</b></div><div><span>CONSTRUCTORS' WORLD CHAMPION</span><b>${escapeHTML(record.constructorsChampion)}</b><small>Winning drivers: ${record.constructorDrivers.map(escapeHTML).join(' · ')}</small></div></div>`;
  dialog.showModal();
}
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
async function init() {
  document.querySelector('#copyright-year').textContent = new Date().getFullYear();
  try {
    const response = await fetch('data/champions.json');
    if (!response.ok) throw new Error(`Could not load championship data (${response.status})`);
    records = await response.json();
    if (!Array.isArray(records)) throw new Error('Championship data must be a JSON array.');
    renderStats(); populateFilters(); renderChampionships(); renderArchive(); renderLegends();
  } catch (error) {
    document.querySelector('#championship-list').innerHTML = `<p class="load-error">Championship records could not be loaded. ${escapeHTML(error.message)} Open this site through GitHub Pages or a local static web server.</p>`;
  }
}
seasonFilter.addEventListener('change', renderChampionships);
tierFilter.addEventListener('change', renderChampionships);
archiveSearch.addEventListener('input', renderArchive);
archiveList.addEventListener('click', event => { const button = event.target.closest('[data-record]'); if (button) showDetails(Number(button.dataset.record)); });
document.querySelector('.dialog-close').addEventListener('click', () => document.querySelector('#details-dialog').close());
document.querySelector('#details-dialog').addEventListener('click', event => { if (event.target === event.currentTarget) event.currentTarget.close(); });
init();
