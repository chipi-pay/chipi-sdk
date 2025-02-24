import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _tanstack_react_query from '@tanstack/react-query';

interface ChipiSDKConfig$1 {
    apiKey: string;
    rpcUrl: string;
    argentClassHash: string;
    contractAddress: string;
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

interface CreateWalletParams {
    encryptKey: string;
    apiKey: string;
}
interface CreateWalletResponse {
    success: boolean;
    wallet: WalletData;
    txHash: string;
}
declare const createArgentWallet: (params: CreateWalletParams) => Promise<CreateWalletResponse>;

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

declare function useSign(): {
    sign: () => string;
};

interface ChipiProviderProps {
    children: React.ReactNode;
    config: ChipiSDKConfig$1;
}

export { type ChipiSDKConfig$1 as C, type TransactionResult as T, type WalletData as W, type CreateWalletResponse as a, ChipiProvider as b, createArgentWallet as c, useCreateWallet as d, useSign as e, type ChipiProviderProps as f, useChipiContext as u };
