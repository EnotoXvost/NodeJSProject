document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const registerBtn = document.getElementById('registerBtn');

    function checkInputs() {
      const usernameValue = usernameInput.value.trim();
      const passwordValue = passwordInput.value.trim();

      if (usernameValue !== '' && passwordValue !== '') {
        registerBtn.removeAttribute('disabled');
      } else {
        registerBtn.setAttribute('disabled', 'disabled');
      }
    }

    usernameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);
});