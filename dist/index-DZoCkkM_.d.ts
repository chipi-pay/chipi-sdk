import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _tanstack_react_query from '@tanstack/react-query';
import { Call, TypedData, Signature } from 'starknet';

interface ChipiSDKConfig$1 {
    apiKey: string;
}
interface WalletData {
    publicKey: string;
    encryptedPrivateKey: string;
}
interface TransactionResult {
}
interface TransferParams {
    recipient: string;
    amount: string | number;
    decimals?: number;
}
interface IncrementParams {
}
type TransactionParams = {
    type: 'transfer' | 'approve';
    params: TransferParams;
} | {
    type: 'wildcard';
    params: IncrementParams;
};
interface SimpleTransactionInput {
    pin: string;
    wallet: WalletData;
    contractAddress: string;
    calls: Call[];
}
interface ExecuteSponsoredTransactionParams {
    publicKey: string;
    typeData: TypedData;
    userSignature: Signature;
}
interface PrepareTypedDataParams {
    publicKey: string;
    calls: Call[];
}

interface ChipiSDKConfig {
    apiKey: string;
}
interface ChipiContextValue {
    config: ChipiSDKConfig;
}
declare function ChipiProvider({ children, config }: {
    children: React.ReactNode;
    config: ChipiSDKConfig;
}): react_jsx_runtime.JSX.Element;
declare function useChipiContext(): ChipiContextValue;

interface CreateWalletParams {
    encryptKey: string;
    apiKey: string;
}
interface CreateWalletResponse {
    success: boolean;
    wallet: WalletData;
    txHash: string;
}

interface UseCreateWalletOptions {
    onSuccess?: (createWalletResponse: CreateWalletResponse) => void;
    onError?: (error: Error) => void;
}
declare function useCreateWallet(options?: UseCreateWalletOptions): {
    createWallet: _tanstack_react_query.UseMutateFunction<CreateWalletResponse, Error, Omit<CreateWalletParams, "apiKey">, unknown>;
    createWalletAsync: _tanstack_react_query.UseMutateAsyncFunction<CreateWalletResponse, Error, Omit<CreateWalletParams, "apiKey">, unknown>;
    isCreating: boolean;
    error: Error | null;
    wallet: CreateWalletResponse | undefined;
};

interface UseSignOptions {
    wallet: WalletData;
    onSuccess?: (txHash: string) => void;
    onError?: (error: Error) => void;
}
declare function useSign({ wallet, ...options }: UseSignOptions): {
    sign: _tanstack_react_query.UseMutateFunction<string, Error, SignParams, unknown>;
    isSigning: boolean;
    error: Error | null;
    lastTxHash: string | undefined;
};
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

interface ChipiProviderProps {
    children: React.ReactNode;
    config: ChipiSDKConfig$1;
}

export { type ChipiSDKConfig$1 as C, type ExecuteSponsoredTransactionParams as E, type IncrementParams as I, type PrepareTypedDataParams as P, type SimpleTransactionInput as S, type TransactionResult as T, type WalletData as W, type TransferParams as a, type TransactionParams as b, ChipiProvider as c, useCreateWallet as d, useSign as e, type ChipiProviderProps as f, useChipiContext as u };
