import { cairo, type Call, type Uint256 } from "starknet";
import {
  executePaymasterTransaction,
  ExecuteTransactionParams,
} from "./send-transaction-with-paymaster";
import type {
  ApproveParams,
  CallAnyContractParams,
  ChipiSDKConfig,
  CreateWalletParams,
  StakeVesuUsdcParams,
  TransferParams,
  WithdrawVesuUsdcParams,
} from "./types";
import { createArgentWallet } from "./create-argent-wallet";
import { CreateWalletResponse } from "./types";

export class ChipiSDK {
  private apiPublicKey: string;
  private readonly nodeUrl = "https://starknet-mainnet.public.blastapi.io/rpc/v0_7";

  constructor(config: ChipiSDKConfig) {
    this.apiPublicKey = config.apiPublicKey;
    
    // Bind all methods to preserve this context
    this.executeTransaction = this.executeTransaction.bind(this);
    this.transfer = this.transfer.bind(this);
    this.approve = this.approve.bind(this);
    this.stakeVesuUsdc = this.stakeVesuUsdc.bind(this);
    this.withdrawVesuUsdc = this.withdrawVesuUsdc.bind(this);
    this.callAnyContract = this.callAnyContract.bind(this);
    this.createWallet = this.createWallet.bind(this);
  }

  private formatAmount(amount: string | number, decimals: number = 18): string {
    const amountStr = amount.toString();
    // Si es un número entero, multiplicar por 10^decimals
    if (!amountStr.includes('.')) {
      const amountBN = BigInt(amountStr) * BigInt(10) ** BigInt(decimals);
      console.log('Formatted integer amount:', amountBN.toString());
      return amountBN.toString();
    }

    // Si tiene decimales, manejamos como antes
    const [integerPart, decimalPart = ''] = amountStr.split('.');
    const paddedDecimal = decimalPart.padEnd(decimals, '0').slice(0, decimals);
    const amountBN = BigInt(integerPart + paddedDecimal);
    
    return amountBN.toString();
  }

  async executeTransaction(input: Omit<ExecuteTransactionParams, 'apiPublicKey'>): Promise<string> {
    return executePaymasterTransaction({
      ...input,
      apiPublicKey: this.apiPublicKey,
    });
  }

  async transfer(params: Omit<TransferParams, 'apiPublicKey'>): Promise<string> {
    const { encryptKey, wallet, contractAddress, recipient, amount, decimals, bearerToken } = params;
    const formattedAmount = this.formatAmount(amount, decimals);
    
    return this.executeTransaction({
      encryptKey,
      wallet,
      bearerToken,
      calls: [
        {
          contractAddress,
          entrypoint: "transfer",
          calldata: [
            recipient,
            formattedAmount,
            "0x0",
          ],
        },
      ],
    });
  }

  async approve(params: Omit<ApproveParams, 'apiPublicKey'>): Promise<string> {
    const { encryptKey, wallet, contractAddress, spender, amount, decimals, bearerToken } = params;
    return this.executeTransaction({
      encryptKey,
      wallet,
      bearerToken,
      calls: [
        {
          contractAddress,
          entrypoint: "approve",
          calldata: [
            spender,
            this.formatAmount(amount, decimals),
            "0x0",
          ],
        },
      ],
    });
  }

  async stakeVesuUsdc(params: Omit<StakeVesuUsdcParams, 'apiPublicKey'>): Promise<string> {
    const { encryptKey, wallet, amount, receiverWallet, bearerToken } = params;
    const formattedAmount = this.formatAmount(amount, 6);
    
    return this.executeTransaction({
      encryptKey,
      wallet,
      bearerToken,
      calls: [
        {
          contractAddress:"0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
          entrypoint: "approve",
          calldata: [
            "0x017f19582c61479f2fe0b6606300e975c0a8f439102f43eeecc1d0e9b3d84350",
            formattedAmount,
            "0x0",
          ],
        },
        {
          contractAddress:"0x017f19582c61479f2fe0b6606300e975c0a8f439102f43eeecc1d0e9b3d84350",
          entrypoint: "deposit",
          calldata: [
            formattedAmount,
            "0x0",
            receiverWallet,
          ],
        },
      ],
    });
  }

  async withdrawVesuUsdc(params: Omit<WithdrawVesuUsdcParams, 'apiPublicKey'>): Promise<string> {
    const { encryptKey, wallet, amount, recipient, bearerToken } = params;
    const formattedAmount = this.formatAmount(amount, 6);
    
    return this.executeTransaction({
      encryptKey,
      wallet,
      bearerToken,
      calls: [
        {
          contractAddress: "0x017f19582c61479f2fe0b6606300e975c0a8f439102f43eeecc1d0e9b3d84350",
          entrypoint: "withdraw",
          calldata: [
            formattedAmount,
            recipient,
            "0x0",
          ],
        },
      ],
    });
  }

  async callAnyContract(params: Omit<CallAnyContractParams, 'apiPublicKey'>): Promise<string> {
    const { encryptKey, wallet, contractAddress, calls, bearerToken } = params;
    return this.executeTransaction({
      encryptKey,
      wallet,
      bearerToken,
      calls,
    });
  }

  async createWallet(params: Omit<CreateWalletParams, 'apiPublicKey' | 'nodeUrl'>): Promise<CreateWalletResponse> {
    const { encryptKey, bearerToken } = params;
    return createArgentWallet({
      encryptKey: encryptKey,
      apiPublicKey: this.apiPublicKey,
      bearerToken,
      nodeUrl: this.nodeUrl,
    });
  }
}

// Export types
// export type { ChipiSDKConfig, WalletData, TransactionResult };