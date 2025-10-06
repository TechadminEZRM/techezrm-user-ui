import { useMutation } from "@tanstack/react-query";
import { submitDetailToBookACall, BookCallQueryRequest } from "../services/bookCallService";

export const useBookACallQuery = () => {
  return useMutation({
    mutationFn: (data: BookCallQueryRequest) => submitDetailToBookACall(data),
  });
};
