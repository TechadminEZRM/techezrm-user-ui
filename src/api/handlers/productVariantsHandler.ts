import { useQuery } from "@tanstack/react-query";
import { productVariantsService } from "../services/productVariants";

export const useProductVariants = (productId: string) => {
  return useQuery({
    queryKey: ["productVariants", productId],
    queryFn: () => productVariantsService.getProductVariants(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
