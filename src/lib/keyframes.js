import _ from 'lodash';
import autoprefixer from 'autoprefixer';

let renderKeyframe = (keyframe) => {
  var steps = []

  _.each(keyframe.steps, (step) => {
    var at = _.isArray(step.at) ? step.at : [ step.at ]
    at = _.map(at, (percentage) => percentage + '%')

    var rules = _.map(step.rules, (value, key) => `${key}: ${value};`)

    steps.push(`${at.join(', ')} { ${rules.join(' ')} }`)
  })

  return autoprefixer.process(`
    @keyframes ${keyframe.name} {
      ${steps.join('\n')}
    }
  `).css
}

export function renderKeyframes(keyframes) {
  var definitions = []

  _.each(keyframes, (keyframe) => {
    definitions.push(renderKeyframe(keyframe))
  })

  return definitions.join('\n')
}

export function ensureKeyframes(keyframes) {
  _.each(keyframes, (keyframe) => {
    // TODO detect if shadowy keyframes are supported?

    let key = keyframe.name

    if (!document.querySelector('style[data-keyframe="' + key + '"]')) {
      let style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      style.setAttribute('data-keyframe', key)
      style.innerHTML = renderKeyframe(keyframe)

      document.head.appendChild(style)
    }
  })
}