import { BASE_URL, GaslessOptions } from "@avnu/gasless-sdk";
import type {
  ChipiSDKConfig,
  ExecuteSponsoredTransactionParams,
  PrepareTypedDataParams,
} from "./types";
import { prepareTypedDataInternal } from "./paymaster/prepare-typed-data";
import { TypedData } from "starknet";
import { executeSponsoredTransactionInternal } from "./paymaster/execute-sponsored-transaction";

export class ChipiClient {
  private paymasterOptions: GaslessOptions;
  // private rpcUrl: string;
  // private argentClassHash: string;
  // private contractAddress: string;
  // private contractEntryPoint: string;

  constructor(config: ChipiSDKConfig) {
    this.paymasterOptions = {
      baseUrl: BASE_URL,
      apiKey: config.apiKey,
    };
    // this.rpcUrl = config.rpcUrl;
    // this.argentClassHash = config.argentClassHash;
  }

  async prepareTypedData(
    input: PrepareTypedDataParams 
  ): Promise<TypedData | null> {
    return prepareTypedDataInternal({
      ...input,
      options: this.paymasterOptions,
    });
  }

  async executeSponsoredTransaction(
    input: ExecuteSponsoredTransactionParams 
  ): Promise<string | null> {
    return executeSponsoredTransactionInternal({
      ...input,
      options: this.paymasterOptions,
    });
  }
}

// // Export types
// export type {
//   ChipiSDKConfig,
//   WalletData,
//   TransactionResult,
// };
