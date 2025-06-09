import { Call } from "starknet";
export interface ChipiSDKConfig {
  apiPublicKey: string;
}

export interface WalletData {
  publicKey: string;
  encryptedPrivateKey: string;
}

export interface TransferParams {
  encryptKey: string;
  wallet: WalletData;
  contractAddress: string;
  recipient: string;
  amount: string | number;
  decimals?: number;
  bearerToken: string;
}

export interface ApproveParams {
  encryptKey: string;
  wallet: WalletData;
  contractAddress: string;
  spender: string;
  amount: string | number;
  decimals?: number;
  bearerToken: string;
}

export interface StakeParams {
  encryptKey: string;
  wallet: WalletData;
  amount: string | number;
  receiverWallet: string;
  bearerToken: string;
}

export interface WithdrawParams {
  encryptKey: string;
  wallet: WalletData;
  recipient: string;
  contractAddress: string;
  amount: string | number;
  decimals?: number;
  bearerToken: string;
}

export interface CallAnyContractParams {
  encryptKey: string;
  wallet: WalletData;
  contractAddress: string;
  calls: Call[];
  bearerToken: string;
}

export interface ExecuteTransactionParams {
  encryptKey: string;
  wallet: WalletData;
  contractAddress: string;
  calls: Call[];
  bearerToken: string;
}

export interface CreateWalletParams {
  encryptKey: string;
  apiPublicKey: string;
  bearerToken: string;
  nodeUrl: string;
}

export interface CreateWalletResponse {
  success: boolean;
  wallet: WalletData;
  txHash: string;
}

export interface IncrementParams {}
export type TransactionParams =
  | {
      type: "transfer" | "approve";
      params: TransferParams;
    }
  | {
      type: "wildcard";
      params: IncrementParams;
    };
export interface SimpleTransactionInput {
  pin: string;
  wallet: WalletData;
  contractAddress: string;
  calls: Call[];
}
export interface TransactionInput {
  pin: string;
  wallet: WalletData;
  calls: Call[];
}
export interface TransactionResult {
  success: boolean;
  accountAddress: string;
  encryptedPrivateKey: string;
  txHash: string;
}

export enum CrosschainNetworks {
  "STARKNET_MAINNET",
  "ARBITRUM_MAINNET",
  "BASE_MAINNET",
}

export enum StarknetAssets {
  ETH = "ETH",
  USDC = "USDC",
}

export enum ArbitrumAssets {
  USDC = "USDC",
}

export enum BaseAssets {
  USDC = "USDC",
  ETH = "ETH",
}

export enum CrosschainAssets {
  sETH = StarknetAssets.ETH,
  sUDC = StarknetAssets.USDC,
  aUSDC = ArbitrumAssets.USDC,
  bUSDC = BaseAssets.USDC,
  bETH = BaseAssets.ETH
}

// Interface para definir la información detallada de un asset
export interface AssetInfo {
  symbol: string;
  display_asset: string;
  logo: string;
  contract: string;
  decimals: number;
  price_in_usd: number;
  precision: number;
  listing_date: string;
  source_rank: number;
  destination_rank: number;
}

export type AssetNetworkMap = {
  [StarknetAssets.ETH]: CrosschainNetworks;
  [StarknetAssets.USDC]: CrosschainNetworks;
  [ArbitrumAssets.USDC]: CrosschainNetworks;
  [BaseAssets.USDC]: CrosschainNetworks;
  [BaseAssets.ETH]: CrosschainNetworks;
};

// Configuración de assets por red
export const CROSSCHAIN_ASSETS: Record<CrosschainNetworks, Record<string, AssetInfo>> = {
  [CrosschainNetworks.STARKNET_MAINNET]: {
    [StarknetAssets.ETH]: {
      symbol: "ETH",
      display_asset: "ETH",
      logo: "https://prodlslayerswapbridgesa.blob.core.windows.net/layerswap/currencies/eth.png",
      contract: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      decimals: 18,
      price_in_usd: 2508.59,
      precision: 8,
      listing_date: "2022-05-30T13:07:01.946576+00:00",
      source_rank: 2,
      destination_rank: 2
    },
    [StarknetAssets.USDC]: {
      symbol: "USDC",
      display_asset: "USDC",
      logo: "https://prodlslayerswapbridgesa.blob.core.windows.net/layerswap/currencies/usdc.png",
      contract: "0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b",
      decimals: 6,
      price_in_usd: 0.99977,
      precision: 6,
      listing_date: "2025-01-24T13:29:24.294897+00:00",
      source_rank: 0,
      destination_rank: 3
    }
  },
  [CrosschainNetworks.ARBITRUM_MAINNET]: {
    [ArbitrumAssets.USDC]: {
      symbol: "USDC.e",
      display_asset: "USDC.e",
      logo: "https://prodlslayerswapbridgesa.blob.core.windows.net/layerswap/currencies/usdc.e.png",
      contract: "0x2a22f9c3b484c3629090feed35f17ff8f88f76f0",
      decimals: 6,
      price_in_usd: 0.99977,
      precision: 6,
      listing_date: "2024-09-04T13:57:22.511306+00:00",
      source_rank: 1,
      destination_rank: 0
    }
  },
  [CrosschainNetworks.BASE_MAINNET]: {
    // Agregar assets de Base aquí cuando sea necesario
  }
};

// Tipos útiles para usar con SendCrossChainParams
export type ValidDestinationNetwork = keyof typeof CROSSCHAIN_ASSETS;
export type ValidAssetForNetwork<T extends CrosschainNetworks> = keyof typeof CROSSCHAIN_ASSETS[T];

// Función helper para obtener la red de un asset
export function getAssetNetwork(asset: StarknetAssets | ArbitrumAssets | BaseAssets): CrosschainNetworks {
  // Implementación que mapea un asset a su red
  if (Object.values(StarknetAssets).includes(asset as StarknetAssets)) {
    return CrosschainNetworks.STARKNET_MAINNET;
  } else if (Object.values(ArbitrumAssets).includes(asset as ArbitrumAssets)) {
    return CrosschainNetworks.ARBITRUM_MAINNET;
  } else if (Object.values(BaseAssets).includes(asset as BaseAssets)) {
    return CrosschainNetworks.BASE_MAINNET;
  }
  throw new Error(`Unknown asset: ${asset}`);
}

// Versión mejorada de SendCrossChainParams con validación de tipos
export interface SendCrossChainParamsTyped<T extends CrosschainNetworks = CrosschainNetworks> {
  destinationNetwork: T;
  destinationAsset: ValidAssetForNetwork<T>;
  destinationAddress: string;
  amount: string;
  sourceChain?: CrosschainNetworks;
  sourceAsset?: StarknetAssets | ArbitrumAssets | BaseAssets;
}

// Nuevo tipo que combina SendCrossChainParams con los parámetros de autenticación
export interface SendCrossChainWithAuthParams {
  encryptKey: string;
  wallet: WalletData;
  bearerToken: string;
  apiPublicKey: string;
  destinationNetwork: CrosschainNetworks;
  destinationAsset: string;
  destinationAddress: string;
  amount: string | number;
  sourceChain?: CrosschainNetworks;
  sourceAsset?: StarknetAssets | ArbitrumAssets | BaseAssets;
}