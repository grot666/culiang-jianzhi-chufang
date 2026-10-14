import { calculateTargets } from './core/nutrition.js';

const STORAGE_KEY = 'culiang.v1.profile';

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
    // populate form
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
  // load changelog later
}

init();

// PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW failed', err));
}
