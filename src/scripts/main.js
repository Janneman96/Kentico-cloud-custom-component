if (CustomElement) {
  CustomElement.init(function (element, _context) {
    // Set up the Custom element using JSON parameters
    console.log('element', element);
    var initialValue = element.value;
    var configuration = element.config;
  });
}

/**
 * Saves the value to the Kentico Cloud UI.
 * @param {string} value The new value.
 */
function saveValue(value) {
  if (!CustomElement) {
    return;
  }
  CustomElement.setValue(value);
}

/**
 * Resizes the custom element iframe.
 * @param {number} height The height in pixels.
 */
function resizeIframe(height) {
  if (!CustomElement) {
    return;
  }
  CustomElement.setHeight(height);
}




var inputContainer = document.querySelector('.js-inputs');
var area = document.querySelector('.js-mouse-leave-drop');

(function initImageArea() {
  resizeIframe(600);
  var movableImages = document.querySelectorAll('.js-movable-image');
  for (var i = 0; i < movableImages.length; i++) {
    registerImage(movableImages[i]);
  }
  translateInputsToJson();
})();

function registerImage(image) {
  var id = getUniqueId(image);
  image.setAttribute('data-id', id);
  bindEvents(id);
  addListeners(id);
}

function getUniqueId() {
  var id = 1;
  while (inputContainer.querySelector('input[data-id="' + id + '"]')) {
    id++;
  }
  return id;
}

function bindEvents(id) {
  var image = area.querySelector('img[data-id="' + id + '"]');

  var inputX = document.createElement('input');
  inputX.setAttribute('data-id', id);
  inputX.classList.add('js-submit-x');
  inputX.classList.add('js-write-x');
  inputX.classList.add('js-read-x');
  inputX.value = area.offsetWidth / 2;
  inputContainer.appendChild(inputX);
  inputX.addEventListener('change', function () {
    repositionImageX(inputX.value, image, inputX);
  });

  var inputY = document.createElement('input');
  inputY.setAttribute('data-id', id);
  inputY.classList.add('js-submit-y');
  inputY.classList.add('js-write-y');
  inputY.classList.add('js-read-y');
  inputY.value = area.offsetHeight / 2;
  inputContainer.appendChild(inputY);
  inputY.addEventListener('change', function () {
    repositionImageY(inputY.value, image, inputY);
  });
}

function addListeners(id) {
  var image = area.querySelector('img[data-id="' + id + '"]');

  image.addEventListener('mousedown', function (e) {
    image.setAttribute('data-holding', true);
    repositionImageToCursor(e, id);
  });

  area.addEventListener('mousemove', function (e) {
    var holding = image.getAttribute('data-holding');
    if (!holding) return;
    repositionImageToCursor(e, id);
  })

  area.addEventListener('mouseup', function (e) {
    var holding = image.getAttribute('data-holding');
    if (!holding) return;
    image.setAttribute('data-holding', '');
    repositionImageToCursor(e, id);
  });

  area.addEventListener('mouseleave', function (e) {
    var holding = image.getAttribute('data-holding');
    if (!holding) return;
    image.setAttribute('data-holding', '');
    repositionImageToCursor(e, id);
  })
}

function repositionImageToCursor(e, id) {
  var target = document.querySelector('.js-images-container');
  var rect = target.getBoundingClientRect();
  var x = Math.round(e.clientX - rect.left);
  var y = Math.round(e.clientY - rect.top);

  var image = area.querySelector('img[data-id="' + id + '"]');
  var inputX = inputContainer.querySelector('input.js-write-x[data-id="' + id + '"]');
  var inputY = inputContainer.querySelector('input.js-write-y[data-id="' + id + '"]');

  repositionImageX(x, image, inputX);
  repositionImageY(y, image, inputY);
}

function repositionImageX(x, image, input) {
  if (x < 0) x = 0;
  if (x > area.offsetWidth) x = area.offsetWidth;
  if (image) image.style.left = x + 'px';
  if (input) input.value = x;
}

function repositionImageY(y, image, input) {
  if (y < 0) y = 0;
  if (y > area.offsetHeight) y = area.offsetHeight;
  if (image) image.style.top = y + 'px';
  if (input) input.value = y;

  translateInputsToJson();
}

function translateInputsToJson() {
  var json = {
    images: []
  }

  var allXInputs = document.querySelectorAll('.js-read-x');
  for (var i = 0; i < allXInputs.length; i++) {
    var inputX = allXInputs[i];
    var id = inputX.getAttribute('data-id');
    var inputY = document.querySelector('.js-read-y[data-id="' + id + '"]');
    var position = {
      x: inputX.value,
      y: inputY.value
    };
    if (position.x && position.y) {
      json.images.push(position);
    } else {
      alert('One of the inputs was not filled properly.');
    }
  }
  insertJsonInResult(json);
}

function insertJsonInResult(object) {
  document.querySelector('.js-output').value = JSON.stringify(object);
  saveValue(JSON.stringify(object));
}