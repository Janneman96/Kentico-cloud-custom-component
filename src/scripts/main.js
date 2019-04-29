var kenticoData = null;

/**
 * Saves the value to the Kentico Cloud UI.
 * @param {string} value The new value.
 */
var kenticoSaveValue = function (newStringValue) { };

/**
 * Resizes the custom element iframe.
 * @param {number} height The height in pixels.
 */
var kenticoResizeIframe = function (heightInPixels) { };

(function () {
  try {
    if (!CustomElement) return;

    CustomElement.init(function (element, _context) {
      console.log('kentico element', element);
      kenticoData = JSON.parse(element.value);
      console.log('kentico data', kenticoData);
      var configuration = JSON.parse(element.config);
    });

    kenticoSaveValue = function saveValue(value) {
      CustomElement.setValue(value);
    }

    kenticoResizeIframe = function resizeIframe(height) {
      CustomElement.setHeight(height);
    }
  } catch (e) {
    if (e.message == 'Custom element is not hosted in an IFrame') {
      console.warn('This image editor is currently not hosted in the correct Kentico Cloud environment.');
    } else {
      console.warn('Something went wrong in the Kentico image editor element.\n\n', e);
    }
  }
})();

var inputContainer = document.querySelector('.js-inputs');
var area = document.querySelector('.js-mouse-leave-drop');

(function initImageArea() {
  kenticoResizeIframe(600);
  var movableImages = getImages();
  for (var i = 0; i < movableImages.length; i++) {
    registerImage(movableImages[i]);
  }
  translateInputsToJson();
})();

function getImages() {
  if ((!kenticoData) || (!kenticoData.images.length)) {
    return document.querySelectorAll('.js-movable-image');
  }

  var imageElements = [];
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    var imageElement = document.createElement('img');
    imageElement.className = 'js-movable-image';
    imageElement.src = 'assets/grocery.svg';
    imageElement.style.left = image.x;
    imageElement.style.top = image.y;
    imageElement.setAttribute('data-position-left', image.x);
    imageElement.setAttribute('data-position-top', image.y);
    imageElements.push(imageElement);
  }
  return imageElements;
}

function registerImage(image) {
  var id = getUniqueId(image);
  image.setAttribute('data-id', id);
  bindEvents(image);
  addListeners(id);
}

function getUniqueId() {
  var id = 1;
  while (inputContainer.querySelector('input[data-id="' + id + '"]')) {
    id++;
  }
  return id;
}

function bindEvents(imageElement) {
  var id = imageElement.getAttribute('data-id');

  var inputX = document.createElement('input');
  inputX.setAttribute('data-id', id);
  inputX.classList.add('js-submit-x');
  inputX.classList.add('js-write-x');
  inputX.classList.add('js-read-x');

  var left = parseInt(imageElement.getAttribute('data-position-left')) || area.offsetWidth / 2;
  inputX.value = left;
  imageElement.style.left = left;

  inputContainer.appendChild(inputX);
  inputX.addEventListener('change', function () {
    repositionImageX(inputX.value, imageElement, inputX);
  });

  var inputY = document.createElement('input');
  inputY.setAttribute('data-id', id);
  inputY.classList.add('js-submit-y');
  inputY.classList.add('js-write-y');
  inputY.classList.add('js-read-y');

  var top = parseInt(imageElement.getAttribute('data-position-top')) || area.offsetHeight / 2;
  inputY.value = top;
  imageElement.style.top = top;

  if (!inputY.value) {
    inputY.value = area.offsetHeight / 2;
    imageElement.style.top = area.offsetHeight / 2;
  }
  inputContainer.appendChild(inputY);
  inputY.addEventListener('change', function () {
    repositionImageY(inputY.value, imageElement, inputY);
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
  var valueToSave = {
    images: []
  }

  var allXInputs = document.querySelectorAll('.js-read-x');

  var doAlert = false;
  for (var i = 0; i < allXInputs.length; i++) {
    var inputX = allXInputs[i];
    var id = inputX.getAttribute('data-id');
    var inputY = document.querySelector('.js-read-y[data-id="' + id + '"]');
    var position = {
      x: inputX.value,
      y: inputY.value
    };
    if (position.x && position.y) {
      valueToSave.images.push(position);
    } else {
      doAlert = true;
    }
  }
  if (doAlert) alert('One of the inputs was not filled properly.');
  insertJsonInResult(valueToSave);
}

function insertJsonInResult(object) {
  document.querySelector('.js-output').value = JSON.stringify(object);
  kenticoSaveValue(JSON.stringify(object));
}