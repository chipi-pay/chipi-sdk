import { useMutation } from "@tanstack/react-query";
import { useChipiContext } from "../context";
import { StakeVesuUsdcParams } from "../../core";




export function useStakeVesuUsdc() {
  const { chipiSDK } = useChipiContext();

  const mutation = useMutation<string, Error, Omit<StakeVesuUsdcParams, 'apiPublicKey'>>({
    mutationFn: chipiSDK.stakeVesuUsdc,
  });

  return {
    stake: mutation.mutate,
    stakeAsync: mutation.mutateAsync,
    stakeData: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}