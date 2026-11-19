const scene = document.querySelector('#scene');
const partButtons = [...document.querySelectorAll('.part')];
const selected = new Set(['door']);
const status = document.querySelector('#build-status');
function renderCollection() {
  for (const button of partButtons) {
    const part = button.dataset.part;
    const active = selected.has(part);
    button.setAttribute('aria-pressed', String(active));
    button.querySelector('.part-check').textContent = active ? '✓' : '+';
    scene.classList.toggle(`has-${part}`, active);
  }
  document.querySelector('#progress').style.width = `${selected.size * 20}%`;
  status.textContent = selected.size === 5
    ? 'Ваша кофейня собрана. Можно заходить на кофе.'
    : `${selected.size} из 5 деталей. История продолжается.`;
}
for (const button of partButtons) {
  button.addEventListener('click', () => {
    const part = button.dataset.part;
    if (part === 'door') {
      status.textContent = 'Дом и дверь — основа коллекции. Добавьте навес, столик, зелень или кота.';
      return;
    }
    selected.has(part) ? selected.delete(part) : selected.add(part);
    renderCollection();
  });
}
document.querySelector('#reset').addEventListener('click', () => {
  selected.clear();
  selected.add('door');
  renderCollection();
});
document.querySelector('#brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const cafe = data.get('cafe').trim();
  const details = data.get('details').trim();
  if (!cafe || !details) {
    document.querySelector('#form-status').textContent = 'Заполните название и описание кофейни.';
    return;
  }
  const text = `КОФЕЙНЫЙ ГОРОД\nБриф миниатюры\n\nНазвание кофейни: ${cafe}\n\nОсобенные детали:\n${details}\n\nПервая коллекция: ${data.get('pieces')}\n\nЭто сохранённый бриф концепции. Он не является заказом и не отправлен исполнителю.\n`;
  const url = URL.createObjectURL(new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'coffee-city-brief.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#form-status').textContent = 'Бриф подготовлен и передан браузеру для скачивания.';
});
renderCollection();
