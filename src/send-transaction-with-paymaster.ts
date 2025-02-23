import {
    fetchBuildTypedData,
    fetchExecuteTransaction,
    GaslessOptions,
  } from "@avnu/gasless-sdk";
  import { Account, Call, RpcProvider } from "starknet";
  import { decryptPrivateKey } from "./lib/encryption";

  export interface ExecuteTransactionParams {
    pin: string;
    wallet: {
      publicKey: string;
      encryptedPrivateKey: string;
    }; //ClerkWallet;
    calls: Call[];
    rpcUrl: string;
    options: GaslessOptions;
  }

  export const executePaymasterTransaction = async (params: ExecuteTransactionParams): Promise<string | null> => {
  try {
    const { pin, wallet, calls, rpcUrl, options } = params;
    console.log("Params: ", params);
     // Fetch the encrypted private key from clerk public metadata
     const privateKeyDecrypted = decryptPrivateKey(
        wallet.encryptedPrivateKey,
        pin,
      );
  
      if (!privateKeyDecrypted) {
        throw new Error("Failed to decrypt private key");
      }

    const provider = new RpcProvider({
        nodeUrl: rpcUrl,
    });
    
    const accountAX = new Account(
        provider,
        wallet.publicKey,
        privateKeyDecrypted,
      );

      // Build the type data
      const typeData = await fetchBuildTypedData(
        wallet.publicKey,
        calls,
        undefined,
        undefined,
        options,
      );
  
      // Sign the message
      const userSignature = await accountAX.signMessage(typeData);
  
      // Execute the transaction
      const executeTransaction = await fetchExecuteTransaction(
        wallet.publicKey,
        JSON.stringify(typeData),
        userSignature,
        options,
      );

      return executeTransaction.transactionHash;
  } catch (error) {
    console.error("Error sending transaction with paymaster", error);
    return null;
  }
}
  