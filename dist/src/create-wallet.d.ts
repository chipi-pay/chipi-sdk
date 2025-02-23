import type { GaslessOptions } from "@avnu/gasless-sdk";
export interface CreateWalletParams {
    pin: string;
    rpcUrl: string;
    options: GaslessOptions;
    argentClassHash: string;
    contractAddress: string;
    contractEntryPoint: string;
}
export declare const createArgentWallet: (params: CreateWalletParams) => Promise<{
    success: boolean;
    accountAddress: string;
    encryptedPrivateKey: string;
    txHash: string;
}>;
