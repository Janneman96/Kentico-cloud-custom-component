console.log('main.js');

$('.js-submit-input-text').on('keyup', function () {
  saveValue(this.value);
});

CustomElement.init((element, _context) => {
  // Set up the Custom element using JSON parameters
});

/**
 * Saves the value to the Kentico Cloud UI.
 * @param {string} value New value
 */
function saveValue(value) {
  console.log('setting value to', value);
  CustomElement.setValue(value);
}

/**
 * Resizes the custom element iframe.
 * @param {number} height Height in pixels
 */
function resizeIframe(height) {
  CustomElement.setHeight(height);
}