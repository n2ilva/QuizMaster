const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'cards', 'json');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'metadata.json' && f !== 'cards.json');

for (const f of files) {
  const cards = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const m = {};
  cards.forEach(x => {
    const k = x.category + '|' + x.difficulty;
    const n = parseInt(x.id.split('__').pop(), 10);
    if (!m[k] || n > m[k]) m[k] = n;
  });
  console.log('\n' + f + ' (' + cards.length + ' cards):');
  Object.entries(m).sort().forEach(([k, v]) => console.log('  ' + k + ': ' + v));
}
