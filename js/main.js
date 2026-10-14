import { calculateTargets } from './core/nutrition.js';
import { blendGrains } from './core/grain.js';

const STORAGE_KEY = 'culiang.v1.profile';
let ingredients = [];
let grains = [];

async function loadIngredients() {
  try {
    const res = await fetch('./data/ingredients.json');
    ingredients = await res.json();
    renderIngredients(ingredients);
    grains = ingredients.filter(i => i.cookedYield);
    initMixer();
  } catch (e) {
    console.error('Failed to load ingredients', e);
    document.getElementById('ingredient-list').textContent = '食材数据加载失败';
  }
}

function renderIngredients(list) {
  const el = document.getElementById('ingredient-list');
  if (!list.length) {
    el.innerHTML = '<p>无匹配食材</p>';
    return;
  }
  el.innerHTML = list.map(ing => `
    <div class="card">
      <strong>${ing.name}</strong> ${ing.verified ? '' : '≈'}
      <div>每100g: ${ing.kcal} kcal · P${ing.protein}g · F${ing.fat}g · C${ing.carbs}g · 纤${ing.fiber}g</div>
      <div style="font-size:0.85rem;color:#666">¥${ing.priceCNYPer500g}/500g · 来源: ${ing.source}</div>
    </div>
  `).join('');
}

function initSearch() {
  const input = document.getElementById('ingredient-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    const filtered = ingredients.filter(i => 
      i.name.toLowerCase().includes(q) || 
      (i.tags && i.tags.some(t => t.includes(q)))
    );
    renderIngredients(filtered);
  });
}

function initMixer() {
  const container = document.getElementById('grain-selectors');
  if (!container || !grains.length) return;
  container.innerHTML = grains.map(g => `
    <label>${g.name} (%)
      <input type="number" class="grain-ratio" data-id="${g.id}" min="0" max="100" value="${g.id === 'rice-white' ? 60 : g.id === 'millet' ? 20 : g.id === 'corn-grits' ? 20 : 0}" step="5">
    </label>
  `).join('');
  const btn = document.getElementById('calc-blend');
  if (btn) {
    btn.addEventListener('click', () => {
      const selections = [];
      document.querySelectorAll('.grain-ratio').forEach(input => {
        const pct = +input.value;
        if (pct > 0) {
          const g = grains.find(gr => gr.id === input.dataset.id);
          if (g) selections.push({ ...g, ratioPct: pct });
        }
      });
      const result = blendGrains(selections);
      const el = document.getElementById('blend-result');
      if (!result) {
        el.innerHTML = '<p class="warning">比例总和需为100%</p>';
      } else {
        el.innerHTML = `
          <p>生100g: ${result.rawPer100.kcal} kcal · P${result.rawPer100.protein}g · F${result.rawPer100.fat}g · C${result.rawPer100.carbs}g</p>
          <p>熟100g: ${result.cookedPer100.kcal} kcal · P${result.cookedPer100.protein}g</p>
          <p>一碗熟 (~200g): ≈ ${result.bowlKcal} kcal</p>
          <p>建议水比约 1:${result.waterRatio} （根据电饭煲微调）</p>
          <p>${result.needsSoak ? '含需浸泡谷物（如糙米），建议提前泡30-60分钟' : '小米/玉米渣等可直接入锅'}</p>
          <p class="note">电饭煲步骤：混合谷物，按比例加水，选择普通煮饭模式。</p>
        `;
      }
      el.hidden = false;
    });
  }
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('load failed', e);
    return null;
  }
}

function saveProfile(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...data }));
  } catch (e) {
    console.error('save failed', e);
    alert('存储失败，请检查浏览器设置');
  }
}

function renderTargets(targets) {
  const el = document.getElementById('targets-display');
  el.innerHTML = `
    <p><strong>基础代谢 (BMR):</strong> ${targets.bmr} kcal</p>
    <p><strong>总消耗 (TDEE):</strong> ${targets.tdee} kcal</p>
    <p><strong>每日热量目标:</strong> ${targets.calories} kcal (默认 -20% 赤字)</p>
    <p><strong>蛋白质:</strong> ${targets.proteinG} g (1.6 g/kg)</p>
    <p><strong>脂肪:</strong> ${targets.fatG} g (约 25% 热量)</p>
    <p><strong>碳水:</strong> ${targets.carbsG} g (剩余)</p>
    <p><strong>膳食纤维:</strong> ${targets.fiberG} g</p>
    <p><strong>饮水:</strong> ${targets.waterMl} ml</p>
    ${targets.warnings.length ? `<p class="warning">${targets.warnings.join('<br>')}</p>` : ''}
  `;
  document.getElementById('targets').hidden = false;
}

function initProfile() {
  const form = document.getElementById('profile-form');
  const saved = loadProfile();
  if (saved) {
    document.getElementById('sex').value = saved.sex || 'male';
    document.getElementById('age').value = saved.age || 30;
    document.getElementById('height').value = saved.height || 170;
    document.getElementById('weight').value = saved.weight || 75;
    document.getElementById('goal-weight').value = saved.goalWeight || 70;
    document.getElementById('activity').value = saved.activity || 1.375;
    const targets = calculateTargets(saved);
    renderTargets(targets);
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      sex: form.sex.value,
      age: +form.age.value,
      height: +form.height.value,
      weight: +form.weight.value,
      goalWeight: +form['goal-weight'].value,
      activity: +form.activity.value
    };
    saveProfile(data);
    const targets = calculateTargets(data);
    renderTargets(targets);
  });
}

function initNav() {
  document.querySelectorAll('.bottom-nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const page = document.getElementById(btn.dataset.page);
      if (page) page.classList.add('active');
    });
  });
}

function init() {
  initNav();
  initProfile();
  loadIngredients();
  initSearch();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW failed', err));
}

init();
