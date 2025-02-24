'use strict';

var chunkXZCPTBVX_js = require('./chunk-XZCPTBVX.js');
var gaslessSdk = require('@avnu/gasless-sdk');

async function prepareTypedDataInternal(input) {
  const typeData = await gaslessSdk.fetchBuildTypedData(
    input.publicKey,
    input.calls,
    void 0,
    void 0,
    input.options
  );
  return typeData;
}
async function executeSponsoredTransactionInternal(input) {
  const { publicKey, typeData, userSignature, options } = input;
  const executeTransaction = await gaslessSdk.fetchExecuteTransaction(
    publicKey,
    JSON.stringify(typeData),
    userSignature,
    options
  );
  return executeTransaction.transactionHash;
}

// src/core/chipi-client.ts
var ChipiClient = class {
  // private rpcUrl: string;
  // private argentClassHash: string;
  // private contractAddress: string;
  // private contractEntryPoint: string;
  constructor(config) {
    this.paymasterOptions = {
      baseUrl: gaslessSdk.BASE_URL,
      apiKey: config.apiKey
    };
  }
  async prepareTypedData(input) {
    return prepareTypedDataInternal({
      ...input,
      options: this.paymasterOptions
    });
  }
  async executeSponsoredTransaction(input) {
    return executeSponsoredTransactionInternal({
      ...input,
      options: this.paymasterOptions
    });
  }
};
var export_useSign = void 0;

Object.defineProperty(exports, "ChipiProvider", {
  enumerable: true,
  get: function () { return chunkXZCPTBVX_js.ChipiProvider; }
});
Object.defineProperty(exports, "useChipiContext", {
  enumerable: true,
  get: function () { return chunkXZCPTBVX_js.useChipiContext; }
});
Object.defineProperty(exports, "useCreateWallet", {
  enumerable: true,
  get: function () { return chunkXZCPTBVX_js.useCreateWallet; }
});
exports.ChipiClient = ChipiClient;
exports.useSign = export_useSign;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map