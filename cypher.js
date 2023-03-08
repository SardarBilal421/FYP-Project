function caesarCipherEncrypt(text, shift) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    console.log(text.length);
    let char = text.charAt(i);
    if (char.match(/[a-z]/i)) {
      let code = text.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
    }
    result += char;
  }
  return result;
}

let plaintext = 'I am a Boy';
let shift = 3;
let ciphertext = caesarCipherEncrypt(plaintext, shift);
console.log(ciphertext);
