(function () {
  var allOutfits = [];
  var outfits = [];
  var activeCountFilter = 'all';
  var currentGender = 'female';
  var GENDER_KEY = 'wardrobe-gender';

  var $ = function (id) { return document.getElementById(id); };

  var COLOR_MAP = [
    ['taupe-beige', 'Taupe'], ['taupe/gray', 'Taupe'],
    ['chocolate', 'Chocolate Brown'], ['cream', 'Cream'], ['beige', 'Cream'],
    ['sage', 'Sage Green'], ['navy', 'Navy'],
    ['black-white', 'Black & White'], ['black floral', 'Black Floral'],
    ['black', 'Black'], ['taupe', 'Taupe'],
    ['forest green', 'Forest Green'], ['olive', 'Forest Green'],
    ['dusty purple', 'Dusty Purple'], ['ivory', 'Ivory'],
    ['bright green', 'Bright Green'], ['burgundy', 'Burgundy'], ['plum', 'Burgundy'],
    ['rust', 'Rust Orange'], ['orange/camel', 'Orange/Camel'], ['camel', 'Camel']
  ];

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

  function extractTopColor(item1) {
    var desc = (item1.split(' — ')[1] || '').toLowerCase();
    for (var i = 0; i < COLOR_MAP.length; i++) {
      if (desc.includes(COLOR_MAP[i][0])) return COLOR_MAP[i][1];
    }
    return 'Other';
  }

  function groupByTopColor(list) {
    var groups = {};
    var order = [];
    list.forEach(function (o) {
      var color = extractTopColor(o.item_1);
      if (!groups[color]) { groups[color] = []; order.push(color); }
      groups[color].push(o);
    });
    return { groups: groups, order: order };
  }

  function createCard(o) {
    var card = document.createElement('div');
    card.className = 'outfit-card';
    card.innerHTML =
      '<div class="outfit-card__image-wrap">' +
        '<img class="outfit-card__image" src="' + o.image_path +
        '" alt="' + o.palette + ' outfit" onerror="this.style.display=\'none\'">' +
      '</div>' +
      '<div class="outfit-card__info">' +
        '<p class="outfit-card__palette">' + o.palette + '</p>' +
        '<p class="outfit-card__rationale">' + o.why_it_works + '</p>' +
      '</div>';
    return card;
  }

  function renderGrouped(list) {
    var container = $('collection-groups');
    container.innerHTML = '';
    if (list.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'collection-empty';
      empty.textContent =
        'No outfits in the ' + (currentGender === 'male' ? "men's" : "women's") +
        ' wardrobe yet.';
      container.appendChild(empty);
      return;
    }
    var result = groupByTopColor(list);
    result.order.forEach(function (color) {
      var section = document.createElement('div');
      section.className = 'color-group';
      var title = document.createElement('h3');
      title.className = 'color-group__title';
      title.textContent = color;
      section.appendChild(title);
      var grid = document.createElement('div');
      grid.className = 'outfit-grid';
      result.groups[color].forEach(function (o) { grid.appendChild(createCard(o)); });
      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  function applyFilters() {
    var filtered = outfits.filter(function (o) {
      if (activeCountFilter !== 'all' && o.item_count !== parseInt(activeCountFilter)) return false;
      return true;
    });
    renderGrouped(filtered);
  }

  function initCountFilters() {
    document.querySelectorAll('[data-filter="count"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-filter="count"]').forEach(function (b) {
          b.classList.remove('filter-chip--active');
        });
        btn.classList.add('filter-chip--active');
        activeCountFilter = btn.dataset.value;
        applyFilters();
      });
    });
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
    applyFilters();
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
    initCountFilters();
    fetch('all_40_outfit_suggestions.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        allOutfits = data;
        loadGender(localStorage.getItem(GENDER_KEY) || 'female');
      });
  });
})();
