import { GaslessOptions } from "@avnu/gasless-sdk";
import { Call } from "starknet";
export interface ExecuteTransactionParams {
    pin: string;
    wallet: {
        publicKey: string;
        encryptedPrivateKey: string;
    };
    calls: Call[];
    rpcUrl: string;
    options: GaslessOptions;
}
export declare const executePaymasterTransaction: (params: ExecuteTransactionParams) => Promise<string | null>;
