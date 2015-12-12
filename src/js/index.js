const marked = require('marked');

const EL = {
  display: document.getElementById('display')
};

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

/**
 * Convert the dropped file
 * and display it as HTML.
 */
function convertToMarkdown(event) {
  event.stopPropagation();
  event.preventDefault();
  const file   = event.dataTransfer.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', event => {
    EL.display.innerHTML = marked(event.target.result);
  });
  reader.readAsText(file, 'utf-8');
}

EL.display.addEventListener('dragover', handleDragOver);
EL.display.addEventListener('drop', convertToMarkdown);
