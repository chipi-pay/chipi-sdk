import { CrosschainNetworks, SendCrossChainParamsTyped, SendCrossChainWithAuthParams } from "./types";
import { decryptPrivateKey } from "./lib/encryption";
import { BACKEND_URL } from "./backend-url";

export interface CrosschainPaymentParams {
  apiPublicKey: string;
  bearerToken: string;
  encryptKey: string;
  wallet: {
    publicKey: string;
    encryptedPrivateKey: string;
  };
  destinationAddress: string;
  destinationAsset: string;
  amount: string;
  sourceChain: CrosschainNetworks;
  sourceAsset: string;
}


export const sendPaymentStarknetToArbitrum = async (
  params: CrosschainPaymentParams
): Promise<string> => {
  try {
    const { apiPublicKey, bearerToken, encryptKey, wallet, destinationAddress, destinationAsset, amount, sourceChain, sourceAsset } = params;

    /* const privateKeyDecrypted = decryptPrivateKey(
        wallet.encryptedPrivateKey,
        encryptKey
    );

    if (!privateKeyDecrypted) {
        throw new Error("Failed to decrypt private key");
    } */

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
    // TODO: Implementar la lógica de ejecución de la transacción
    
    if (!result.transactionHash) {
      throw new Error('La respuesta no contiene el hash de la transacción');
    }

    return "TEST COMPLETE";
  } catch (error) {
    console.error("Error executing cross-chain transaction:", error);
    throw error;
  }
};
