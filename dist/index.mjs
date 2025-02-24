export { ChipiProvider, useChipiContext, useCreateWallet } from './chunk-QRYK56XM.mjs';
import { BASE_URL, fetchBuildTypedData, fetchExecuteTransaction } from '@avnu/gasless-sdk';

async function prepareTypedDataInternal(input) {
  const typeData = await fetchBuildTypedData(
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
  const executeTransaction = await fetchExecuteTransaction(
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
      baseUrl: BASE_URL,
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

export { ChipiClient, export_useSign as useSign };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map