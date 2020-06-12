import marked from 'marked';
import sanitize from 'sanitize-html';

export function renderContents(text) {
  var renderedText = text;

  renderedText = marked(renderedText);

  renderedText = sanitize(renderedText, {
    allowedTags: [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'b', 'strong', 'i', 'em' ],
    allowedAttributes: {
      'a': ['href', 'target', 'rel']
    },
    transformTags: {
      'a': (tagName, attribs) => {
        if (attribs) {
          attribs.target = '_blank';
          attribs.rel = 'noopener noreferrer';
        }

        return {
          tagName: tagName,
          attribs: attribs
        };
      }
    }
  });

  return renderedText;
}