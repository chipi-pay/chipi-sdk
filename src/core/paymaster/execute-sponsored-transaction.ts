import { fetchExecuteTransaction, GaslessOptions } from "@avnu/gasless-sdk";
import { ExecuteSponsoredTransactionParams } from "../types";

export async function executeSponsoredTransactionInternal(
  input: ExecuteSponsoredTransactionParams & { options: GaslessOptions }
) {
  const { publicKey, typeData, userSignature, options } = input;
  const executeTransaction = await fetchExecuteTransaction(
    publicKey,
    JSON.stringify(typeData),
    userSignature,
    options
  );
  return executeTransaction.transactionHash;
}
