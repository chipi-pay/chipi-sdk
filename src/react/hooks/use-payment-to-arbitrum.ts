import { useMutation } from "@tanstack/react-query";
import { useChipiContext } from "../context";
import { CrosschainPaymentParams } from "../../core";

export function usePaymentToArbitrum() {
  const { chipiSDK } = useChipiContext();

  const mutation = useMutation<string, Error, Omit<CrosschainPaymentParams, 'apiPublicKey'>>({
    mutationFn: chipiSDK.paymentToArbitrum,
  });

  return {
    paymentToArbitrum: mutation.mutate,
    paymentToArbitrumAsync: mutation.mutateAsync,
    paymentToArbitrumData: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}