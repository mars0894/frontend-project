const getRandomUppercase = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);
const getRandomLowercase = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97);
const getRandomNumber = () => String.fromCharCode(Math.floor(Math.random() * 10) + 48);
const getRandomSymbol = () => {
  const symbols = '!@#;:,.<>?_+[]{}|$%^&*()`~';
  return symbols[Math.floor(Math.random() * symbols.length)];
};


function generatePassword(length, options) {
  const { uppercase, lowercase, numbers, symbols } = options;
  const funcs = [];
  if (uppercase) funcs.push(getRandomUppercase);
  if (lowercase) funcs.push(getRandomLowercase);
  if (numbers) funcs.push(getRandomNumber);
  if (symbols) funcs.push(getRandomSymbol);

  if (funcs.length === 0 || length == 0) {
    alert('Please select at least one character type!');
    return '';
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomFunc = funcs[Math.floor(Math.random() * funcs.length)];
    password += randomFunc();
  }
  return password;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then()
  alert('Password copied!');
}

function calculateStrength(password) {
  const len = password.length >= 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNums = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password);

  const passwordProps = [len, hasUpper, hasLower, hasNums, hasSymbols].filter(Boolean).length;

  if (passwordProps >= 4) return 'Hard';
  if (passwordProps >= 3) return 'Medium';
  return 'Easy';
}

function hashPasswordSync(password) {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
}



function updateHistory(password) {
  const salt = generatePassword(12, { numbers: true });
  const saltedPassword = salt + password;
  const hashedPassword = hashPasswordSync(saltedPassword);
  const historyDiv = document.getElementById('history');
  const newEntry = document.createElement('div');
  newEntry.textContent = 'Password: ' + password + ' Encrypted: ' + encryptedPassword + ' Hash: ' + hashedPassword + ' Salt: ' + salt;
  historyDiv.prepend(newEntry);
}

document.getElementById('generate').addEventListener('click', () => {
  const length = parseInt(document.getElementById('length').value);
  const options = {
    uppercase: document.getElementById('uppercase').checked,
    lowercase: document.getElementById('lowercase').checked,
    numbers: document.getElementById('numbers').checked,
    symbols: document.getElementById('symbols').checked,
  };

  const password = generatePassword(length, options);
  document.getElementById('password').textContent = password;
  if (password) {
    const strength = calculateStrength(password);
    document.getElementById('strength').textContent = 'Strength: ' + strength;
    updateHistory(password);
  }
});

document.getElementById('copy').addEventListener('click', () => {
  const password = document.getElementById('password').textContent;
  if (password) {
    copyToClipboard(password);
  } else {
    alert('Generate a password first!');
  }
});

