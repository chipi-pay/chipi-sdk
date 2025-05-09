# Chipi SDK 

SDK para crear wallets y enviar transacciones usando el paymaster de AVNU.

## Instalación

```bash
npm install @chipi-pay/chipi-sdk
```

## Uso

```typescript
import { ChipiSDK } from '@chipi-pay/chipi-sdk';

// Inicializar el SDK
const sdk = new ChipiSDK({
  paymasterApiKey: 'tu-api-key',
  rpcUrl: 'https://starknet-goerli.infura.io/v3/tu-api-key',
  argentClassHash: '0x...', // opcional, tiene un valor por defecto
  contractAddress: '0x...', // opcional, tiene un valor por defecto
  contractEntryPoint: 'get_counter' // opcional, tiene un valor por defecto
});

// Crear wallet
const wallet = await sdk.createWallet('1234');
// Resultado: { success: true, txHash: '0x...' }

// Enviar transacción
const result = await sdk.executeTransaction({
  pin: '1234',
  wallet: {
    publicKey: '0x...',
    encryptedPrivateKey: 'encrypted...',
  },
  calls: [
    {
      contractAddress: '0x...',
      entrypoint: 'increment',
      calldata: ['0x...']
    }
  ]
});
// Resultado: string (hash de la transacción) o null si hay error
```

## Tipos

```typescript
interface ChipiSDKConfig {
  paymasterApiKey: string;
  rpcUrl: string;
  argentClassHash?: string;
  contractAddress?: string;
  contractEntryPoint?: string;
}

interface WalletData {
  publicKey: string;
  encryptedPrivateKey: string;
}

interface TransactionResult {
  success: boolean;
  txHash: string;
}
```
