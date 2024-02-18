"use strict";
//html elements

const plainTextEl = document.querySelector("#plaintext");
const keywordEl = document.querySelector("#keyword");
const encryptedTextEl = document.querySelector(".transformed-text");
const matrixEl = document.querySelector(".pc__matrix");
const encryptButton = document.querySelector(".pc__encrypt--btn");

// Globals
const noOfAlphabets = 26;
const alphabets = new Array(100).fill("#");
const matrix = new Array(5);
for (let i = 0; i < 5; i++) {
  matrix[i] = new Array(5).fill("#");
}
let key;
let plainText;

//functions
const unique = function () {
  return [...new Set(key.split(""))].join("").replaceAll(" ", "");
};

const charToAscii = function (character) {
  return character.charCodeAt(0);
};

const createMatrix = function (key) {
  const ht = alphabets;
  let n = 0;
  let l = key.length;
  let _i;
  let _j;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (n < l) {
        matrix[i][j] = key[n];
        _i = i;
        _j = j;
        ht[charToAscii(key[n]) - 97] = "#";
        n++;
      }
    }
  }
  n = 0;

  let i = _j === 4 ? _i + 1 : _i;
  let j = _j === 4 ? 0 : _j + 1;
  for (; i < 5; i++) {
    while (j < 5) {
      if (ht[n] !== "#" && ht[n] !== "j") {
        matrix[i][j] = ht[n];
        j++;
      }
      n++;
    }
    j = 0;
  }
};

const indexOfChar = function (ch) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] == ch) {
        return [i, j];
      }
    }
  }
  return [0, 0];
};

const extractAlphabets = function (inputString) {
  // Use a regular expression to match non-alphabetic characters and replace them with an empty string
  var resultString = inputString.replace(/[^a-zA-Z]/g, "");

  return resultString;
};

const encrypt = function (plainText) {
  const pairs = [];
  let encryptedText = "";
  plainText = extractAlphabets(plainText).toLowerCase();

  plainText = plainText.replaceAll("j", "i");

  if (plainText.length % 2 !== 0) plainText += "x";
  let n = 0;
  for (let i = 0; i < plainText.length; i += 2) {
    pairs[n++] = plainText.slice(i, i + 2);
  }
  for (let i = 0; i < pairs.length; i++) {
    let i1 = indexOfChar(pairs[i][0])[0];
    let j1 = indexOfChar(pairs[i][0])[1];
    let i2 = indexOfChar(pairs[i][1])[0];
    let j2 = indexOfChar(pairs[i][1])[1];
    if (i1 !== i2 && j1 !== j2) {
      //diagonal
      encryptedText += matrix[i1][j2];
      encryptedText += matrix[i2][j1];
    } else if (i1 === i2) {
      //same row
      j1 = (j1 + 1) % 5;
      j2 = (j2 + 1) % 5;
      encryptedText += matrix[i1][j1];
      encryptedText += matrix[i2][j2];
    } else if (j1 === j2) {
      //same column
      i1 = (i1 + 1) % 5;
      i2 = (i2 + 1) % 5;
      encryptedText += matrix[i1][j1];
      encryptedText += matrix[i2][j2];
    }
  }
  return encryptedText;
};

const displayMatrix = function () {
  matrixEl.textContent = "";
  for (let i = 0; i < 5; i++) {
    const rows = `
        <tr class="tr-${i}"></tr>

    `;
    matrixEl.insertAdjacentHTML("beforeend", rows);
    for (let j = 0; j < 5; j++) {
      const columns = `
        <td>${matrix[i][j]}</tr>

    `;
      document
        .querySelector(`.tr-${i}`)
        .insertAdjacentHTML("beforeend", columns);
    }
  }
};

//eventlisteners
encryptButton.addEventListener("click", function () {
  key = keywordEl.value;
  key = key.toLowerCase().replaceAll("j", "i");
  if (!key) return;
  plainText = plainTextEl.value;
  //initializing alphabets array
  for (let i = 0; i < 26; i++) alphabets[i] = String.fromCharCode(i + 97);

  //unique characters of the key
  const keyUniqueChars = unique();

  //creating the matrix
  createMatrix(keyUniqueChars);

  displayMatrix();

  //the encrypted text
  encryptedTextEl.textContent = encrypt(plainText);
});
