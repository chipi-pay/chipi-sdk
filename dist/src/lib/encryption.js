"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPrivateKey = exports.encryptPrivateKey = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const encryptPrivateKey = (privateKey, password) => {
    if (!privateKey || !password) {
        throw new Error("Private key and password are required");
    }
    return crypto_js_1.default.AES.encrypt(privateKey, password).toString();
};
exports.encryptPrivateKey = encryptPrivateKey;
const decryptPrivateKey = (encryptedPrivateKey, password) => {
    if (!encryptedPrivateKey || !password) {
        console.error("Encrypted private key and password are required");
        return null;
    }
    try {
        const bytes = crypto_js_1.default.AES.decrypt(encryptedPrivateKey, password);
        const decrypted = bytes.toString(crypto_js_1.default.enc.Utf8);
        // Check if the decrypted string is empty
        if (!decrypted) {
            return null;
        }
        return decrypted;
    }
    catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};
exports.decryptPrivateKey = decryptPrivateKey;
