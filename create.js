const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, 'img');

;(async () => {
  const data = [];
  const dir = await fs.promises.opendir(imgPath);
  for await (const dirent of dir) {
    const extname = path.extname(dirent.name || '');
    if (/(svg|jpg|png)/.test(extname)) {
      data.push(`<span class="${extname.replace(/^\./, '')}" data-ext="${extname}" data-name="${dirent.name}"><img src="${dirent.name}" width="88" alt="${(dirent.name).replace(/.(svg|jpg|png)$/, '')}" /><i>${dirent.name}</i></span>`);
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>logo</title>
  <style>
    :root {
      --jpg-color: #b4d9f7;
      --png-color: #e2b0ea;
      --svg-color: #ffd967;
    }
    body { text-align: center; margin: 0; }
    img { width: 88px; display: block; margin: 0 auto; }
    span { 
      display: inline-block;
      border: 1px solid #d8d8d8;
      border-radius: 5px;
      margin: 5px 5px;
      padding: 5px;
    }
    span::before, span i {
      text-align: left;
      display: block;
      font-size: 12px;
      background: #f5f5f5;
      border-radius: 3px;
      padding: 1px 3px;
    }
    span::before { content: attr(data-ext); margin-bottom: 5px; }
    span i {
      content: attr(data-name);
      margin-top: 5px;
      font-style: initial;
    }
    span.svg { border: 1px solid var(--svg-color); }
    span.svg::before {
      background: var(--svg-color);
    }
    span.png { border: 1px solid var(--png-color); }
    span.png::before {
      background: var(--png-color);
    }
    span.jpg { border: 1px solid var(--jpg-color); }
    span.jpg::before { background: var(--jpg-color); }
    form { display: flex; padding: 10px 0 0 0; justify-content: center; }
    form label { display: flex; align-items: center; }
  </style>
</head>
<body>
  <form id="form">
    <label>
      <input type="checkbox" name="checkbox" value=".jpg" checked /> jpg
    </label>
    <label>
      <input type="checkbox" name="checkbox" value=".svg" checked /> svg
    </label>
    <label>
      <input type="checkbox" name="checkbox" value=".png" checked /> png
    </label>
    <label>
      <input type="search" name="search" />
    </label>
  </form>
  <h1>Github: <a target="_blank" href="https://github.com/jaywcjlove/logo">@jaywcjlove/logo</a></h1>
  <div id="content">
    ${data.join('')}
  </div>
  <script type="text/javascript" src="https://unpkg.com/validator.tool/dist/validator.min.js"></script>
  <script type="text/javascript">
  var validator = new Validator({
    form: document.getElementById('form'),
  });
  var content = document.getElementById('content');
  var childs = [...content.children];
  validator.form.onchange = handleChange;
  validator.form.oninput = handleChange;
  function handleChange() {
    var data = validator.getValues();
    var exts = data.checkbox || [];
    var arr = Array.from(childs).map(elm => exts.includes(elm.dataset.ext) && elm).filter(Boolean).filter((elm) => elm.dataset.name.indexOf(data.search) > -1);
    content.innerHTML = '';
    arr.forEach(elm => content.appendChild(elm));
  }
  </script>
</body>
</html>
  `;
  await fs.promises.writeFile(path.join(imgPath, 'index.html'), html);
  console.log(
    '\x1b[32;1m Successfully created `index.html` file \x1b[0m\n',
    `=> \x1b[32;1m${path.join(imgPath, 'index.html')} \x1b[0m `
  )
})();
