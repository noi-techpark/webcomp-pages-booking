import _ from 'lodash';
import $ from 'jquery';

let __scrollTop = () => {
  return $(document).scrollTop();
};

let __viewportHeight = () => {
  if (document.compatMode === 'BackCompat') {
      return document.body.clientHeight;
  }

  return document.documentElement.clientHeight;
};

let __documentHeight = () => {
  let html = document.querySelector('html');
  let body = document.querySelector('body');

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
};

export function scrollTo(context, target) {
  let scrollTop = () => {
    return (window.pageXOffset !== undefined) ? window.pageYOffset : ((document.compatMode || '') === 'CSS1Compat') ? document.documentElement.scrollTop : document.body.scrollTop;
  };

  var clientRect = context.getBoundingClientRect();
  var to = scrollTop() + clientRect.top;

  var match = target.match(/^([0-9]+)%$/);
  if (!!match) {
    to += (clientRect.height * (parseFloat(match[1]) / 100));
  }

  to -= 40;

  var start = scrollTop(),
    change = Math.abs(to - start),
    currentTime = 0,
    increment = 20;

  if (start < to) {
    var duration = Math.round(Math.log(change / 50) * 250);

    let easeInOutQuad = (t, b, c, d) => {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    };

    let animateScroll = () => {
      currentTime += increment;

      window.scroll(0, easeInOutQuad(currentTime, start, change, duration));

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }
}

export function scrollFromStart() {
  return __scrollTop();
}

export function scrollUntilEnd() {
  var offset = __scrollTop();
  offset += __viewportHeight();
  return (__documentHeight() - offset);
}