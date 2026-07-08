/* 오늘 뭐 먹지 - 메뉴 추천기 로직 */
(function () {
  const mealButtons = document.querySelectorAll(".meal-toggle button");
  const chipButtons = document.querySelectorAll(".filter-chips button");
  const resultBox = document.getElementById("resultBox");
  const pickBtn = document.getElementById("pickBtn");
  const againBtn = document.getElementById("againBtn");

  if (!resultBox || !pickBtn) return; // 이 스크립트가 필요 없는 페이지면 종료

  let currentMeal = "lunch";
  let currentTag = "all";
  let lastPicked = null;

  mealButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      mealButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentMeal = btn.dataset.meal;
      renderPlaceholder();
    });
  });

  chipButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      chipButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentTag = btn.dataset.tag;
      renderPlaceholder();
    });
  });

  function getPool() {
    return MENU_DATA.filter((item) => {
      const mealOk = item.meals.includes(currentMeal);
      const tagOk = currentTag === "all" || item.tags.includes(currentTag) || item.cat === currentTag;
      return mealOk && tagOk;
    });
  }

  function renderPlaceholder() {
    resultBox.innerHTML = '<p class="placeholder">버튼을 눌러 오늘의 메뉴를 추천받아 보세요 🍽️</p>';
    againBtn.style.display = "none";
  }

  function pick() {
    const pool = getPool();
    if (pool.length === 0) {
      resultBox.innerHTML = '<p class="placeholder">조건에 맞는 메뉴가 없어요. 다른 필터를 선택해보세요!</p>';
      return;
    }
    let candidates = pool;
    if (pool.length > 1 && lastPicked) {
      const filtered = pool.filter((i) => i.name !== lastPicked.name);
      if (filtered.length > 0) candidates = filtered;
    }
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    lastPicked = picked;

    resultBox.innerHTML =
      '<div class="result-name">' + picked.name + "</div>" +
      '<div class="result-desc">' + picked.desc + "</div>" +
      '<div class="result-tags">' +
      '<span>' + picked.cat + "</span>" +
      picked.tags.map((t) => "<span>#" + t + "</span>").join("") +
      "</div>";
    againBtn.style.display = "inline-block";
  }

  pickBtn.addEventListener("click", pick);
  againBtn.addEventListener("click", pick);

  renderPlaceholder();
})();
