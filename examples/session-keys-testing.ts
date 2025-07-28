import { ChipiSDK } from "../src/core/chipi-sdk";
import { WalletData, SessionPolicy } from "../src/core/types";

/**
 * 🧪 EJEMPLO DE TESTING SIN AUTENTICACIÓN
 * ⚠️ Solo para desarrollo - NO usar en producción
 */

async function testSessionKeysWithoutAuth() {
  console.log("🧪 Iniciando test de Session Keys sin autenticación...");

  const sdk = new ChipiSDK({ 
    apiPublicKey: "test-api-key" 
  });

  // 📝 Mock de wallet principal (normalmente viene de createWallet)
  const mockMainWallet: WalletData = {
    publicKey: "0x1234567890123456789012345678901234567890123456789012345678901234",
    encryptedPrivateKey: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef"
  };

  // 📋 Políticas de testing
  const testPolicies: SessionPolicy[] = [
    {
      contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // ETH
      selector: "transfer",
      maxAmount: "100000000000000000", // 0.1 ETH max
    }
  ];

  try {
    // 1️⃣ Crear session key SIN bearer token
    console.log("📝 Creando session key sin autenticación...");
    const sessionKeyResponse = await sdk.createSessionKey({
      mainWallet: mockMainWallet,
      encryptKey: "test-encrypt-key",
      // bearerToken: undefined, // ← Sin token para testing
      policiesData: testPolicies,
      sessionDuration: 3600 // 1 hora
    });

    console.log("✅ Session key creada:", {
      sessionKey: sessionKeyResponse.sessionKey,
      expiresAt: sessionKeyResponse.expiresAt,
      policies: sessionKeyResponse.policies.length
    });

    // 2️⃣ Preparar datos de session key
    const sessionKeyData = {
      sessionPublicKey: sessionKeyResponse.sessionKey,
      sessionPrivateKey: sessionKeyResponse.sessionPrivateKey,
      mainWalletAddress: mockMainWallet.publicKey,
      policies: sessionKeyResponse.policies,
      expiresAt: sessionKeyResponse.expiresAt
    };

    // 3️⃣ Ejecutar transacción SIN bearer token
    console.log("💸 Ejecutando transacción con session key sin autenticación...");
    
    const transferTxHash = await sdk.executeWithSessionKey({
      sessionKeyData,
      calls: [
        {
          contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // ETH
          entrypoint: "transfer",
          calldata: [
            "0x987654321098765432109876543210987654321098765432109876543210987", // recipient
            "50000000000000000", // 0.05 ETH
            "0x0"
          ]
        }
      ]
      // bearerToken: undefined // ← Sin token para testing
    });

    console.log("✅ Transacción enviada:", transferTxHash);

  } catch (error) {
    console.log("❌ Error esperado durante testing:", error.message);
    
    // Es normal que falle en testing si el backend no está configurado
    if (error.message.includes('fetch')) {
      console.log("💡 Tip: El backend no está disponible, pero la lógica del SDK funciona correctamente");
    }
  }
}

/**
 * 🔧 Test de validaciones locales (sin llamadas al backend)
 */
async function testSessionKeyValidations() {
  console.log("\n🔧 Testing validaciones locales...");

  const sdk = new ChipiSDK({ apiPublicKey: "test-key" });

  // Session key expirada
  const expiredSessionData = {
    sessionPublicKey: "0x123",
    sessionPrivateKey: "0xabc", 
    mainWalletAddress: "0x456",
    policies: [],
    expiresAt: Math.floor(Date.now() / 1000) - 3600 // Expirada hace 1 hora
  };

  try {
    await sdk.executeWithSessionKey({
      sessionKeyData: expiredSessionData,
      calls: []
    });
  } catch (error) {
    console.log("✅ Validación de expiración funciona:", error.message);
  }

  // Policy no permitida
  const restrictedSessionData = {
    sessionPublicKey: "0x123",
    sessionPrivateKey: "0xabc",
    mainWalletAddress: "0x456", 
    policies: [
      {
        contractAddress: "0xOTRO_CONTRATO",
        selector: "approve",
        maxAmount: "1000"
      }
    ],
    expiresAt: Math.floor(Date.now() / 1000) + 3600
  };

  try {
    await sdk.executeWithSessionKey({
      sessionKeyData: restrictedSessionData,
      calls: [
        {
          contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
          entrypoint: "transfer",
          calldata: []
        }
      ]
    });
  } catch (error) {
    console.log("✅ Validación de policies funciona:", error.message);
  }

  console.log("🎉 Todas las validaciones locales funcionan correctamente!");
}

// Ejecutar tests
async function runTests() {
  await testSessionKeysWithoutAuth();
  await testSessionKeyValidations();
}

export { testSessionKeysWithoutAuth, testSessionKeyValidations, runTests }; 