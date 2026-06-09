"use client";
import type React from "react";
import { useState } from "react";
import { ShoppingCart, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { useCart } from "@/api/handlers/cartHandler";
import { Spinner } from "@/components/ui/spinner";
import CartItems from "./CartItems";
import LoadCalculation from "./LoadCalculation";

const ShoppingCartPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, customer } = useAppStore();
  const [discount, setDiscount] = useState("");

  const { data: cartResponse, isLoading: cartLoading, error: cartError, isError: cartIsError } = useCart(customer?.id || "", { enabled: !!customer?.id });

  const cartData = cartResponse?.data?.cart;
  const cartItems = cartData?.items || [];
  const subtotal = cartData?.totalAmount || 0;

  if (cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-center py-16">
            <Spinner size="lg" className="border-brand border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (cartIsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6 text-center py-16">
          <p className="text-lg font-medium text-red-600 mb-2">Error loading cart</p>
          <p className="text-sm text-dim">{cartError instanceof Error ? cartError.message : "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !customer) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-[120px] h-[120px] bg-paper rounded-full flex items-center justify-center mb-2 border-2 border-dashed border-line-light">
              <ShoppingCart className="w-12 h-12 text-brand" />
            </div>
            <h3 className="font-semibold text-body text-[1.1rem] mb-2">Please Login to View Your Cart</h3>
            <p className="text-dim text-sm mb-8 max-w-[400px] leading-relaxed">
              You need to be signed in to view and manage your shopping cart items. Login to your account or create a new one to get started.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <button onClick={() => router.push("/sign_in")} className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-8 py-2 text-sm font-semibold rounded transition-colors min-w-[140px] justify-center">
                <LogIn className="w-4 h-4" /> Login
              </button>
              <button onClick={() => router.push("/sign_up")} className="border border-brand text-brand hover:bg-[rgba(249,169,34,0.04)] hover:border-brand-hover px-8 py-2 text-sm font-semibold rounded transition-colors min-w-[140px]">
                Sign Up
              </button>
            </div>
            <div className="mt-4 p-6 bg-paper rounded max-w-[500px]">
              <p className="text-dim text-xs leading-relaxed text-center">
                <strong>Why sign in?</strong><br />
                • Save items for later<br />
                • Track your orders<br />
                • Faster checkout process<br />
                • Access exclusive deals
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6">
          <style>{`@keyframes float{0%,100%{transform:translateY(0px) rotate(0deg)}50%{transform:translateY(-20px) rotate(2deg)}}@keyframes cartBounce{0%,100%{transform:scale(1)}25%{transform:scale(1.1)}50%{transform:scale(1.05)}75%{transform:scale(1.15)}}`}</style>
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center min-h-[60vh]">
            <div className="w-40 h-40 mb-8 relative" style={{ animation: "float 3s ease-in-out infinite" }}>
              <div className="w-full h-full rounded-[25px] border-[3px] border-dashed border-brand flex items-center justify-center shadow-[0_12px_40px_rgba(255,107,53,0.15)]" style={{ background: "linear-gradient(135deg, var(--color-brand-light) 0%, var(--color-brand-light) 100%)" }}>
                <ShoppingCart className="w-16 h-16 text-brand" style={{ animation: "cartBounce 2s ease-in-out infinite" }} />
              </div>
            </div>
            <h2 className="text-[1.5rem] md:text-[2rem] font-semibold text-body mb-4">Your Cart is Empty</h2>
            <p className="text-dim mb-8 max-w-[500px] text-sm md:text-[1.1rem] leading-relaxed">
              Add some amazing products to your cart and they will appear here. Start shopping to build your perfect order!
            </p>
            <button
              onClick={() => router.push("/product")}
              className="bg-brand hover:bg-brand-hover text-white px-12 py-4 text-[1.1rem] font-semibold rounded-[12px] shadow-[0_6px_20px_rgba(255,107,53,0.3)] hover:shadow-[0_8px_30px_rgba(255,107,53,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log(cartItems, "cartItems__cartItems");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="p-8 bg-gradient-to-br from-white to-[#f8fafc] rounded-xl border border-line shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <CartItems cartItems={cartItems} />
            <hr className="border-[#cecece] my-4" />
            <div className="mt-8">
              <LoadCalculation />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
