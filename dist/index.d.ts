import { C as ChipiSDKConfig, P as PrepareTypedDataParams, E as ExecuteSponsoredTransactionParams } from './index-DZoCkkM_.js';
export { c as ChipiProvider, f as ChipiProviderProps, I as IncrementParams, S as SimpleTransactionInput, b as TransactionParams, T as TransactionResult, a as TransferParams, W as WalletData, u as useChipiContext, d as useCreateWallet, e as useSign } from './index-DZoCkkM_.js';
import { TypedData } from 'starknet';
import 'react/jsx-runtime';
import '@tanstack/react-query';

declare class ChipiClient {
    private paymasterOptions;
    constructor(config: ChipiSDKConfig);
    prepareTypedData(input: PrepareTypedDataParams): Promise<TypedData | null>;
    executeSponsoredTransaction(input: ExecuteSponsoredTransactionParams): Promise<string | null>;
}

export { ChipiClient, ChipiSDKConfig, ExecuteSponsoredTransactionParams, PrepareTypedDataParams };
