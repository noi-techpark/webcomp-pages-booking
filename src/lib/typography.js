import _ from 'lodash';

let renderFont = (font) => {
  var sources = []

  if (!!font.woff) {
    sources.push(`url(${font.woff}) format('woff')`)
  }

  if (!!font.woff2) {
    sources.push(`url(${font.woff2}) format('woff2')`)
  }

  if (!!font.ttf) {
    sources.push(`url(${font.ttf}) format('ttf')`)
  }

  return `
    @font-face {
      font-display: ${font.display || 'swap'};
      font-family: '${font.name}';
      font-style: ${font.style || 'normal'};
      font-weight: ${font.weight || 'normal'};
      src: ${sources.join(', ')};
    }
  `
}

export function renderFonts(fonts) {
  var definitions = []

  _.each(fonts, (font) => {
    definitions.push(renderFont(font))
  })

  return definitions.join('\n')
}

export function ensureFonts(fonts) {
  _.each(fonts, (font) => {
    // TODO detect if shadowy fonts are supported?

    let key = font.name + '@' + (font.weight || 'normal')

    if (!document.querySelector('style[data-font="' + key + '"]')) {
      let style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      style.setAttribute('data-font', key)
      style.innerHTML = renderFont(font)

      document.head.appendChild(style)
    }
  })
}