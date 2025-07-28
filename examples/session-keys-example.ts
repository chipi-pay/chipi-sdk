import { ChipiSDK } from "../src/core/chipi-sdk";
// import { SessionKeyStorage } from "../src/core/session-key-storage";
import { WalletData, SessionPolicy } from "../src/core/types";

/**
 * Ejemplo completo de uso de Session Keys con ChipiSDK
 */

async function sessionKeysExample() {
  const sdk = new ChipiSDK({ 
    apiPublicKey: "your-api-key" 
  });

  // 1️⃣ Crear wallet principal primero
  const walletResponse = await sdk.createWallet({
    encryptKey: "user-encryption-key",
    bearerToken: "user-bearer-token"
  });

  const mainWallet: WalletData = walletResponse.wallet;

  // 2️⃣ Definir políticas para la session key
  const sessionPolicies: SessionPolicy[] = [
    {
      contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // ETH
      selector: "transfer",
      maxAmount: "100000000000000000", // 0.1 ETH max
    },
    {
      contractAddress: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8", // USDC  
      selector: "transfer",
      maxAmount: "100000000", // 100 USDC max
    }
  ];

  // 3️⃣ Crear session key
  console.log("📝 Creando session key...");
  const sessionKeyResponse = await sdk.createSessionKey({
    mainWallet,
    encryptKey: "user-encryption-key",
    bearerToken: "user-bearer-token",
    policiesData: sessionPolicies,
    sessionDuration: 3600 // 1 hora
  });

  console.log("✅ Session key creada:", sessionKeyResponse.sessionKey);

  // 4️⃣ Almacenar session key de forma segura (⚠️ usar cifrado en producción)
  const sessionKeyData = {
    sessionPublicKey: sessionKeyResponse.sessionKey,
    sessionPrivateKey: sessionKeyResponse.sessionPrivateKey,
    mainWalletAddress: mainWallet.publicKey,
    policies: sessionKeyResponse.policies,
    expiresAt: sessionKeyResponse.expiresAt,
    isActive: true
  };

  // await SessionKeyStorage.storeSessionKey(sessionKeyData);

  // 5️⃣ Usar session key para transferencias (sin necesidad de firmar manualmente)
  console.log("💸 Ejecutando transferencia con session key...");
  
  try {
    const transferTxHash = await sdk.executeWithSessionKey({
      sessionKeyData,
      calls: [
        {
          contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // ETH
          entrypoint: "transfer",
          calldata: [
            "0x1234567890123456789012345678901234567890", // recipient
            "50000000000000000", // 0.05 ETH
            "0x0"
          ]
        }
      ],
      bearerToken: "user-bearer-token"
    });

    console.log("✅ Transferencia completada:", transferTxHash);
  } catch (error) {
    console.error("❌ Error en transferencia:", error.message);
  }

  // 6️⃣ Limpiar session keys expiradas
  // await SessionKeyStorage.clearExpiredSessionKeys();
}

/**
 * Ejemplo de manejo de errores y validaciones
 */
async function sessionKeyValidationExample() {
  const sdk = new ChipiSDK({ apiPublicKey: "your-api-key" });

  // Recuperar session key existente
  // const sessionKey = await SessionKeyStorage.getSessionKey("session-public-key");
  
  /* if (!sessionKey) {
    console.log("❌ Session key no encontrada");
    return;
  } */

  // Verificar si expiró
 /*  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime > sessionKey.expiresAt) {
    console.log("⏰ Session key expirada, removiendo...");
    await SessionKeyStorage.removeSessionKey(sessionKey.sessionPublicKey);
    return;
  } */

  // Verificar si la transacción está permitida por las políticas
  const proposedCall = {
    contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    entrypoint: "transfer",
    calldata: ["0x123...", "1000000000000000000", "0x0"] // 1 ETH
  };

  /* const isAllowed = sessionKey.policies.some(policy => 
    policy.contractAddress === proposedCall.contractAddress &&
    policy.selector === proposedCall.entrypoint
  ); */

  /* if (!isAllowed) {
    console.log("🚫 Transacción no permitida por las políticas de session key");
    return;
  } */

  console.log("✅ Transacción autorizada por session key");
}

// Exportar ejemplos
export { sessionKeysExample, sessionKeyValidationExample }; 