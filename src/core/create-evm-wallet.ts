import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { encryptPrivateKey } from './lib/encryption'
import { CreateWalletParams } from './types'
import { BACKEND_URL } from "./backend-url";


export const createEvmWallet = async (params: CreateWalletParams) => {
  try {
    const { encryptKey, apiPublicKey, bearerToken, nodeUrl } = params;

    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const walletAddress = account.address;
    const encryptedPrivateKey = encryptPrivateKey(privateKey, encryptKey);

    // Backend Call API to create the wallet
    console.log("apiPublicKey", apiPublicKey);
    // TODO: I can add a greeting SC that the wallet its going to execute when it's created
    /* const response = await fetch(`${BACKEND_URL}/chipi-wallets/evm-wallet-creation`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
        'x-api-key': apiPublicKey,
      },
      body: JSON.stringify({
        publicKey: walletAddress,
      }),
    }); */

    return {
      walletAddress,
      encryptedPrivateKey,
    };
  } catch (error) {
    console.error('Error creating Evm wallet: ', error);
    throw error;
  }
}