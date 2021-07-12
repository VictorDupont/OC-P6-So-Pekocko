const CryptoJS = require("crypto-js");

exports.decrypt = (word, key) => {
	let ckey = CryptoJS.enc.Utf8.parse(key);
	let decrypt = CryptoJS.AES.decrypt(word, ckey, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7,
	});

	let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
	return decryptedStr.toString();
};

exports.encrypt = (word, key) => {
	let ckey = CryptoJS.enc.Utf8.parse(key);
	let encrypted = CryptoJS.AES.encrypt(word, ckey, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7,
	});
	return encrypted.toString();
};
