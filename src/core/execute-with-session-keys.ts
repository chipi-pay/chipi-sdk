import { Account, Call, RpcProvider, ec } from "starknet";
import { BACKEND_URL } from "./backend-url";

export const executeWithSessionKey = async (
  sessionKeyData: {
    sessionPrivateKey: string;
    sessionPublicKey: string;
    mainWalletAddress: string;
    policies: any[];
    expiresAt: number;
  },
  calls: Call[],
  apiPublicKey: string,
  bearerToken?: string, // Hacer opcional para testing
  nodeUrl?: string
): Promise<string> => {
  // Validar que la session key no haya expirado
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime > sessionKeyData.expiresAt) {
    throw new Error('Session key has expired');
  }

  // ✅ Validar policies (implementación básica)
  // TODO: Implementar validación completa contra políticas registradas en el dashboard
  const hasValidPolicy = sessionKeyData.policies.some(policy => 
    calls.some(call => 
      call.contractAddress === policy.contractAddress && 
      call.entrypoint === policy.selector
    )
  );
  
  if (!hasValidPolicy) {
    throw new Error('Transaction not allowed by session key policies');
  }

  try {
    const provider = new RpcProvider({
      nodeUrl: "https://cloud.argent-api.com/v1/starknet/mainnet/rpc/v0.7",
    });

    // Crear cuenta con la wallet principal, no con la session key
    const mainAccount = new Account(
      provider,
      sessionKeyData.mainWalletAddress,
      sessionKeyData.sessionPrivateKey // Usar session private key para firmar
    );

    // 🔧 Headers condicionales para testing
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-API-Key": apiPublicKey,
    };
    
    // ⚠️ Comentado para testing - descomentar en producción
    if (bearerToken) {
      headers["Authorization"] = `Bearer ${bearerToken}`;
    }

    // Build the type data
    const typeDataResponse = await fetch(
      `${BACKEND_URL}/transactions/prepare-session-typed-data`, // Endpoint específico para session keys
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          mainWalletAddress: sessionKeyData.mainWalletAddress,
          sessionPublicKey: sessionKeyData.sessionPublicKey,
          calls: calls,
          expiresAt: sessionKeyData.expiresAt,
          accountClassHash: "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f",
        }),
      }
    );

    if (!typeDataResponse.ok) {
      const errorText = await typeDataResponse.text();
      throw new Error(`Error preparing session typed data: ${errorText}`);
    }

    const typeData = await typeDataResponse.json();

    // Firmar con la session key
    const sessionSignature = await mainAccount.signMessage(typeData);

    // Ejecutar la transacción con session key
    const executeResponse = await fetch(
      `${BACKEND_URL}/transactions/execute-session-transaction`, // Endpoint específico para session keys
      {
        method: "POST",
        headers, // Usar los mismos headers condicionales
        body: JSON.stringify({
          mainWalletAddress: sessionKeyData.mainWalletAddress,
          sessionPublicKey: sessionKeyData.sessionPublicKey,
          typeData: typeData,
          sessionSignature: {
            r: (sessionSignature as any).r.toString(),
            s: (sessionSignature as any).s.toString(),
            recovery: (sessionSignature as any).recovery,
          },
          calls: calls,
        }),
      }
    );

    if (!executeResponse.ok) {
      const errorText = await executeResponse.text();
      throw new Error(`Error executing session transaction: ${errorText}`);
    }

    const result = await executeResponse.json();

    if (!result.transactionHash) {
      throw new Error("Response does not contain transaction hash");
    }

    return result.transactionHash;
  } catch (error) {
    console.error("Error executing session key transaction:", error);
    throw error;
  }
};
