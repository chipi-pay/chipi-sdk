import { fetchBuildTypedData, GaslessOptions } from "@avnu/gasless-sdk";
import { PrepareTypedDataParams } from "../types";

export async function prepareTypedDataInternal(
  input: PrepareTypedDataParams & { options: GaslessOptions }
) {
  const typeData = await fetchBuildTypedData(
    input.publicKey,
    input.calls,
    undefined,
    undefined,
    input.options
  );
  return typeData;
}
