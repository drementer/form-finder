const inputSelector = 'input:not([type="hidden"], [type="submit"]), textarea, select';
const submitButtonSelector = 'input[type="submit"], button[type="submit"]';

const getElementInfo = (element) => {
  const info = {
    name: element.getAttribute('name'),
    type: element.getAttribute('type') || element.tagName.toLowerCase(),
    defaultValue: element.getAttribute('value') || null,
    placeholder: element.getAttribute('placeholder') || null,
  };

  if (info.type === 'select') {
    const selectedOption = element.querySelector('option:selected');
    const firstOption = element.querySelector('option');

    const firstValue = firstOption?.getAttribute('value');
    const selectedValue = selectedOption?.getAttribute('value');

    info.defaultValue = selectedValue || firstValue;
  }

  return info;
};

const checkFormValidity = (form) => {
  const inputs = form.querySelectorAll(inputSelector);
  const submitButton = form.querySelector(submitButtonSelector);

  const haveMultipleInputs = inputs.length > 1;
  const haveSubmitButton = !!submitButton;
  const isValidForm = haveMultipleInputs && haveSubmitButton;

  if (!isValidForm) return;

  return {
    name: form.getAttribute('name') || null,
    action: form.getAttribute('action'),
    method: form.getAttribute('method'),
    elements: inputs.map(getElementInfo),
  };
};

const findForm = (html) => {
  try {
    const forms = html.querySelectorAll('form');
    const validForms = [...forms].map(checkFormValidity).filter(Boolean);

    if (!validForms.length) return false;

    return validForms;
  } catch (error) {
    throw new Error(`Error parsing HTML: ${error.message}`);
  }
};

module.exports = findForm;
