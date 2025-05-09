import { C as CreateWalletParams, a as CreateWalletResponse } from './index-C_43Hpiy.mjs';
export { A as ApproveParams, f as CallAnyContractParams, k as ChipiProvider, l as ChipiProviderProps, b as ChipiSDK, c as ChipiSDKConfig, E as ExecuteTransactionParams, I as IncrementParams, h as SimpleTransactionInput, S as StakeParams, i as TransactionInput, g as TransactionParams, j as TransactionResult, T as TransferParams, W as WalletData, d as WithdrawParams, e as executePaymasterTransaction, o as useApprove, r as useCallAnyContract, u as useChipiContext, m as useCreateWallet, p as useStake, n as useTransfer, q as useWithdraw } from './index-C_43Hpiy.mjs';
import 'react/jsx-runtime';
import 'starknet';
import '@tanstack/react-query';

declare const createArgentWallet: (params: CreateWalletParams) => Promise<CreateWalletResponse>;

export { CreateWalletParams, CreateWalletResponse, createArgentWallet };
