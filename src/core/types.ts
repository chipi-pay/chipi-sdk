import { Call } from "starknet";
export interface ChipiSDKConfig {
  apiPublicKey: string;
}

export interface WalletData {
  publicKey: string;
  encryptedPrivateKey: string;
}

export interface TransferParams {
  encryptKey: string;
  wallet: WalletData;
  contractAddress: string;
  recipient: string;
  amount: string | number;
  decimals?: number;
  bearerToken: string;
}

export interface ApproveParams {
  encryptKey: string;
  wallet: WalletData;
  contractAddress: string;
  spender: string;
  amount: string | number;
  decimals?: number;
  bearerToken: string;
}

export interface StakeVesuUsdcParams {
  encryptKey: string;
  wallet: WalletData;
  amount: string | number;
  receiverWallet: string;
  bearerToken: string;
}

export interface WithdrawVesuUsdcParams {
  encryptKey: string;
  wallet: WalletData;
  recipient: string;
  contractAddress: string;
  amount: string | number;
  decimals?: number;
  bearerToken: string;
}

export interface CallAnyContractParams {
  encryptKey: string;
  wallet: WalletData;
  contractAddress: string;
  calls: Call[];
  bearerToken: string;
}

export interface ExecuteTransactionParams {
  encryptKey: string;
  wallet: WalletData;
  contractAddress: string;
  calls: Call[];
  bearerToken: string;
}

export interface CreateWalletParams {
  encryptKey: string;
  apiPublicKey: string;
  bearerToken: string;
  nodeUrl: string;
}

export interface CreateWalletResponse {
  success: boolean;
  wallet: WalletData;
  txHash: string;
}

export interface IncrementParams {}
export type TransactionParams =
  | {
      type: "transfer" | "approve";
      params: TransferParams;
    }
  | {
      type: "wildcard";
      params: IncrementParams;
    };
export interface SimpleTransactionInput {
  pin: string;
  wallet: WalletData;
  contractAddress: string;
  calls: Call[];
}
export interface TransactionInput {
  pin: string;
  wallet: WalletData;
  calls: Call[];
}
export interface TransactionResult {
  success: boolean;
  accountAddress: string;
  encryptedPrivateKey: string;
  txHash: string;
}
