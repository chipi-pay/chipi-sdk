import { useMutation } from "@tanstack/react-query";
import { useChipiContext } from "../context";
import { WithdrawVesuUsdcParams } from "../../core";




export function useWithdrawVesuUsdc() {
  const { chipiSDK } = useChipiContext();

  const mutation = useMutation<string, Error, Omit<WithdrawVesuUsdcParams, 'apiPublicKey'>>({
    mutationFn: chipiSDK.withdrawVesuUsdc,
  });

  return {
    withdraw: mutation.mutate,
    withdrawAsync: mutation.mutateAsync,
    withdrawData: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}