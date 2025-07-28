import { Call, CallData, ec, stark } from "starknet";
import { CreateWalletParams, WalletData, SessionPolicy, SessionKeyResponse } from "./types";
import { executePaymasterTransaction } from "./send-transaction-with-paymaster";

// Políticas por defecto basadas en la documentación de Argent
const DEFAULT_SESSION_POLICIES: SessionPolicy[] = [
  {
    contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // ETH
    selector: "transfer",
    maxAmount: "1000000000000000000", // 1 ETH max
  },
  {
    contractAddress: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8", // USDC
    selector: "transfer", 
    maxAmount: "1000000000", // 1000 USDC max
  }
];

export const createSessionKey = async (
  params: CreateWalletParams & {
    mainWallet: WalletData;
  },
  policiesData: SessionPolicy[] = DEFAULT_SESSION_POLICIES,
  sessionDuration: number = 24 * 60 * 60 // 24 horas por defecto
): Promise<SessionKeyResponse> => {
  const { mainWallet, encryptKey, apiPublicKey, bearerToken } = params;

  const sessionPrivateKey = stark.randomAddress();
  const sessionPublicKey = ec.starkCurve.getStarkKey(sessionPrivateKey);
  
  const expiresAt = Math.floor(Date.now() / 1000) + sessionDuration;

  const formattedPolicies = policiesData.map(policy => ({
    contractAddress: policy.contractAddress,
    selector: policy.selector,
    maxAmount: policy.maxAmount || "0",
    expiresAt: expiresAt
  }));

  // ✅ Crear la llamada para registrar la session key
  const registerSessionCall: Call = {
    contractAddress: mainWallet.publicKey,
    entrypoint: "register_session",
    calldata: CallData.compile({
      session_key: sessionPublicKey,
      expires_at: expiresAt,
      policies: formattedPolicies.map(p => [
        p.contractAddress,
        p.selector,
        p.maxAmount,
        p.expiresAt
      ])
    })
  };

  try {
    const transactionHash = await executePaymasterTransaction({
      apiPublicKey,
      encryptKey,
      bearerToken: bearerToken || "", // ⚠️ Para testing - hacer string vacío si no hay token
      wallet: mainWallet,
      calls: [registerSessionCall]
    });

    return {
      sessionKey: sessionPublicKey,
      sessionPrivateKey: sessionPrivateKey, // ✅ Crítico para poder usar la session key
      transactionHash,
      policies: formattedPolicies,
      expiresAt
    };
  } catch (error) {
    console.error('Error registrando session key:', error);
    throw new Error(`Failed to register session key: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};