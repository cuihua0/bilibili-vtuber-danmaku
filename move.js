const fs = require('fs').promises

  ;

(async () => {
  const files = await fs.readdir('.')
  const targets = files.filter(f => !Number.isNaN(Number(f)))
  await Promise.all(targets.map(f => fs.rename(f, `danmaku/${f}`)))
})()
