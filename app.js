(function () {
  var allOutfits = [];
  var outfits = [];
  var currentHeroIndex = -1;
  var currentGender = 'female';
  var GENDER_KEY = 'wardrobe-gender';
  var MAX_WORN = 5;

  var $ = function (id) { return document.getElementById(id); };

  function getAutoTheme() {
    var h = new Date().getHours();
    return h >= 6 && h < 18 ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    $('theme-icon').innerHTML = theme === 'dark' ? '&#9788;' : '&#9790;';
  }

  function initTheme() {
    var saved = localStorage.getItem('theme-override');
    applyTheme(saved || getAutoTheme());
    $('theme-toggle').addEventListener('click', function () {
      var next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('theme-override', next);
    });
  }

  // Worn history is namespaced per wardrobe so outfit numbers never collide across genders.
  function wornKey() { return 'worn-history-' + currentGender; }

  function getWornHistory() {
    try { return JSON.parse(localStorage.getItem(wornKey())) || []; }
    catch (e) { return []; }
  }

  function saveWornHistory(history) {
    localStorage.setItem(wornKey(), JSON.stringify(history.slice(-MAX_WORN)));
  }

  function isWorn(outfitNo) {
    return getWornHistory().indexOf(outfitNo) !== -1;
  }

  function updateWornButton() {
    var o = outfits[currentHeroIndex];
    if (!o) return;
    var btn = $('worn-btn');
    var worn = isWorn(o.outfit_no);
    btn.classList.toggle('btn-worn--active', worn);
    btn.textContent = worn ? '✓  Wearing Today' : '○  Wear Today?';
  }

  function toggleWorn() {
    var o = outfits[currentHeroIndex];
    if (!o) return;
    var history = getWornHistory();
    var idx = history.indexOf(o.outfit_no);
    var btn = $('worn-btn');
    btn.classList.remove('btn-worn--pop', 'btn-worn--unpop');
    void btn.offsetWidth;
    if (idx !== -1) {
      history.splice(idx, 1);
      btn.classList.add('btn-worn--unpop');
    } else {
      history.push(o.outfit_no);
      btn.classList.add('btn-worn--pop');
    }
    saveWornHistory(history);
    updateWornButton();
  }

  function getDailyHash() {
    var d = new Date();
    var str = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    var hash = 0;
    for (var i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    return hash;
  }

  function pickDailyOutfit() {
    var worn = getWornHistory();
    var available = outfits.filter(function (o) {
      return worn.indexOf(o.outfit_no) === -1;
    });
    if (available.length === 0) available = outfits;
    var hash = getDailyHash();
    var picked = available[hash % available.length];
    return outfits.indexOf(picked);
  }

  function showEmptyState() {
    currentHeroIndex = -1;
    var img = $('hero-image');
    img.src = '';
    img.style.display = 'none';
    $('hero-palette').textContent = 'Wardrobe is empty';
    $('hero-rationale').textContent =
      'No outfits in the ' + (currentGender === 'male' ? "men's" : "women's") +
      ' wardrobe yet. Add some to start getting daily suggestions.';
    var worn = $('worn-btn');
    worn.disabled = true;
    worn.textContent = '○  Wear Today?';
    worn.classList.remove('btn-worn--active');
    document.querySelectorAll('[data-shuffle-count]').forEach(function (btn) {
      btn.disabled = true;
    });
  }

  function renderHero(index) {
    var o = outfits[index];
    if (!o) { showEmptyState(); return; }
    currentHeroIndex = index;
    $('worn-btn').disabled = false;
    document.querySelectorAll('[data-shuffle-count]').forEach(function (btn) {
      btn.disabled = false;
    });
    var img = $('hero-image');
    img.style.display = '';
    img.src = o.image_path;
    img.alt = o.palette + ' outfit';
    img.onerror = function () { this.style.display = 'none'; };
    $('hero-palette').textContent = o.palette;
    $('hero-rationale').textContent = o.why_it_works;
    updateWornButton();
  }

  function matchesCountFilter(outfit, countFilter) {
    if (countFilter === 'all') return true;
    return outfit.item_count === parseInt(countFilter, 10);
  }

  function shuffleOutfit(countFilter) {
    var worn = getWornHistory();
    var pool = outfits.filter(function (o) { return matchesCountFilter(o, countFilter); });
    if (pool.length === 0) return;

    var available = [];
    outfits.forEach(function (o, i) {
      if (!matchesCountFilter(o, countFilter)) return;
      if (i !== currentHeroIndex && worn.indexOf(o.outfit_no) === -1) available.push(i);
    });
    if (available.length === 0) {
      outfits.forEach(function (o, i) {
        if (!matchesCountFilter(o, countFilter)) return;
        if (i !== currentHeroIndex) available.push(i);
      });
    }
    if (available.length === 0) return;
    renderHero(available[Math.floor(Math.random() * available.length)]);
  }

  function loadGender(gender) {
    currentGender = gender;
    localStorage.setItem(GENDER_KEY, gender);
    document.querySelectorAll('[data-gender]').forEach(function (btn) {
      btn.classList.toggle('wardrobe-btn--active', btn.dataset.gender === gender);
    });
    outfits = allOutfits.filter(function (o) {
      // Women's outfit 18 has no image on disk; skip only that one, not other wardrobes'.
      if (gender === 'female' && o.image_path.includes('outfit_18')) return false;
      return o.wardrobe_gender === gender;
    });
    renderHero(pickDailyOutfit());
  }

  function initWardrobeSwitch() {
    document.querySelectorAll('[data-gender]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.dataset.gender !== currentGender) loadGender(btn.dataset.gender);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initWardrobeSwitch();
    fetch('all_40_outfit_suggestions.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        allOutfits = data;
        document.querySelectorAll('[data-shuffle-count]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            shuffleOutfit(btn.dataset.shuffleCount);
          });
        });
        $('worn-btn').addEventListener('click', toggleWorn);
        loadGender(localStorage.getItem(GENDER_KEY) || 'female');
      });
  });
})();
