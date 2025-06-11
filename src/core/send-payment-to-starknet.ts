import { CrosschainNetworks, CrosschainPaymentParams } from "./types";
import { decryptPrivateKey } from "./lib/encryption";
import { BACKEND_URL } from "./backend-url";
import { Account, Call, RpcProvider } from "starknet";
 

export const sendPaymentStarknetToArbitrum = async (
  params: CrosschainPaymentParams
): Promise<string> => {
  try {
    const { apiPublicKey, bearerToken, encryptKey, wallet, destinationAddress, destinationAsset, amount, sourceChain, sourceAsset } = params;

     const privateKeyDecrypted = decryptPrivateKey(
        wallet.encryptedPrivateKey,
        encryptKey
    );

    if (!privateKeyDecrypted) {
        throw new Error("Failed to decrypt private key");
    }

    // Initiate layerswap process
    const paymentRequest = await fetch(`${BACKEND_URL}/crosschain/starknet-to-evm-payment`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
        'X-API-Key': apiPublicKey,
      },
      body: JSON.stringify({    
        destinationAddress,
        amount,
        destinationNetwork: CrosschainNetworks[CrosschainNetworks.ARBITRUM_MAINNET],
        destinationToken: destinationAsset,
        sourceNetwork: CrosschainNetworks[CrosschainNetworks.STARKNET_MAINNET],
        sourceToken: sourceAsset,
      }),
    });

    if (!paymentRequest.ok) {
      const errorText = await paymentRequest.text();
      throw new Error(`Error en la API de ejecución: ${errorText}`);
    }

    const result = await paymentRequest.json();
    console.log("result", result);

    if (!result.depositActions || result.depositActions.length === 0) {
        throw new Error('No se recibieron acciones de depósito');
    }

    const depositAction = result.depositActions[0];
    const callData = JSON.parse(depositAction.call_data);
    console.log("callData", callData);
    // Finish layerswap process
    
    const calls: Call[] = callData.map((call: any) => ({
        contractAddress: call.contractAddress,
        entrypoint: call.entrypoint,
        calldata: call.calldata,
      }));

      console.log("calls", calls);

    const provider = new RpcProvider({
        nodeUrl: "https://cloud.argent-api.com/v1/starknet/mainnet/rpc/v0.7",
      });
  
      const account = new Account(
        provider,
        wallet.publicKey,
        privateKeyDecrypted
      );
  
      // Build the type data
      const typeDataResponse = await fetch(`${BACKEND_URL}/transactions/prepare-typed-data`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`,
          'X-API-Key': apiPublicKey,
        },
        body: JSON.stringify({
          publicKey: wallet.publicKey,
          calls: calls,
          accountClassHash: "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f"
        }),
      });
  
      if (!typeDataResponse.ok) {
        const errorText = await typeDataResponse.text();
        throw new Error(`Error en la API: ${errorText}`);
      }
  
      const typeData = await typeDataResponse.json();
  
      // Sign the message
      const userSignature = await account.signMessage(typeData);
      //console.log("User signature: ", userSignature);
  
      const executeTransaction = await fetch(`${BACKEND_URL}/transactions/execute-sponsored-transaction`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`,
          'X-API-Key': apiPublicKey,
        },
        body: JSON.stringify({
          publicKey: wallet.publicKey,
          typeData: typeData,
          userSignature: {
            r: (userSignature as any).r.toString(),
            s: (userSignature as any).s.toString(),
            recovery: (userSignature as any).recovery
          }
        }),
      });
  
      if (!executeTransaction.ok) {
        const errorText = await executeTransaction.text();
        throw new Error(`Error en la API de ejecución: ${errorText}`);
      }
    
      const transactionResult = await executeTransaction.json();
      console.log("transactionResult Starknet to Arbitrum ", transactionResult);
      return transactionResult.transactionHash;

  } catch (error) {
    console.error("Error executing cross-chain transaction:", error);
    throw error;
  }
};
