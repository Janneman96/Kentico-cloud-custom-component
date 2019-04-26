$('.js-submit-input-text').value(getValue());

$('.js-submit-input-text').on('keyup', function () {
  saveValue(this.value);
});

CustomElement.init((element, _context) => {
  // Set up the Custom element using JSON parameters
  console.log('element', element);
  console.log('context', _context);
});

/**
 * Saves the value to the Kentico Cloud UI.
 * @param {string} value The new value.
 */
function saveValue(value) {
  CustomElement.setValue(value);
}

/**
 * Returns the value from the Kentico Cloud UI.
 * @returns {string} The value.
 */
function getValue() {
  return CustomElement.getValue();
}

/**
 * Resizes the custom element iframe.
 * @param {number} height The height in pixels.
 */
function resizeIframe(height) {
  CustomElement.setHeight(height);
}