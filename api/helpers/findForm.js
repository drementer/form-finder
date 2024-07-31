const inputSelector = 'input:not([type="hidden"]), textarea, select';
const submitButtonSelector = 'input[type="submit"], button[type="submit"]';

const checkFormValidity = (form) => {
  const inputs = form.querySelectorAll(inputSelector);
  const submitButton = form.querySelector(submitButtonSelector);

  const haveMultipleInputs = inputs.length > 1;
  const haveSubmitButton = !!submitButton;

  return haveMultipleInputs && haveSubmitButton;
};

const findForm = (html) => {
  try {
    const forms = html.querySelectorAll('form');
    const validForms = forms.filter(checkFormValidity);

    return validForms.length;
  } catch (error) {
    throw new Error(`Error parsing HTML: ${error.message}`);
  }
};

module.exports = findForm;
