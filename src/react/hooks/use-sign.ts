// import { useMutation } from '@tanstack/react-query';
import { useMutation } from "@tanstack/react-query";
import { WalletData } from "../../core/types";
import { decryptPrivateKey } from "../../core/lib";
import { Account, Call, RpcProvider, TypedData } from "starknet";

interface UseSignOptions {
  wallet: WalletData;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function useSign({ wallet, ...options }: UseSignOptions) {
  const mutation = useMutation<string, Error, SignParams>({
    mutationFn: sign,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });

  return {
    sign: mutation.mutate,
    isSigning: mutation.isPending,
    error: mutation.error,
    lastTxHash: mutation.data,
  };
}

interface SignOptions {
  apiKey: string;
  baseUrl?: string;
}

interface SignParams {
  wallet: WalletData;
  calls: Call[];
  encryptKey: string;
  nodeUrl: string;
  signOptions: SignOptions;
}

async function sign(params: SignParams) {
  const { wallet, calls, encryptKey, nodeUrl, signOptions } = params;
  const { apiKey, baseUrl } = signOptions;
  if (!apiKey) throw new Error("API key is required");
  let url = baseUrl || "/api/chipi";
  const privateKeyDecrypted = decryptPrivateKey(
    wallet.encryptedPrivateKey,
    encryptKey
  );
  if (!privateKeyDecrypted) {
    throw new Error("Failed to decrypt private key");
  }

  // Initialising the provider
  const provider = new RpcProvider({
    nodeUrl,
  });

  const accountAX = new Account(
    provider,
    wallet.publicKey,
    privateKeyDecrypted
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      publicKey: wallet.publicKey,
      calls: calls,
      operation: "prepare",
    }),
  });
  const typeData = (await response.json()) as TypedData;

  // Sign the message
  const userSignature = await accountAX.signMessage(typeData);

  // Execute the transaction
  const executeResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      publicKey: wallet.publicKey,
      typeData: JSON.stringify(typeData),
      userSignature,
      operation: "execute",
    }),
  });
  const responseData = (await executeResponse.json()) as {
    transactionHash: string;
  };

  return responseData.transactionHash;
}

// export function useSign(){
//   return {
//     sign: () => {
//       return "sign 3";
//     }
//   }
// }
