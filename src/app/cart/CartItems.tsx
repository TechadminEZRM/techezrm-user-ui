import type React from "react";
import { useState } from "react";
import { Plus, Minus, Trash2, X, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { useUpdateCartItem, useRemoveFromCart } from "@/api/handlers/cartHandler";

interface CartItem {
  product: {
    _id: string;
    uniqueId?: string;
    bannerImage?: string;
  };
  productName: string;
  productPrice: number;
  quantity: number;
}

interface CartItemsProps {
  cartItems: CartItem[];
}

const CartItems: React.FC<CartItemsProps> = ({ cartItems }) => {
  const { customer } = useAppStore();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    productId: string;
    productName: string;
  }>({ open: false, productId: "", productName: "" });

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1 || !customer?.id) return;
    updateCartItemMutation.mutate({ productId, data: { customerId: customer.id, quantity: newQuantity } });
  };

  const handleRemoveFromCart = (productId: string, productName: string) => {
    setConfirmationDialog({ open: true, productId, productName });
  };

  const confirmRemoveFromCart = () => {
    if (!customer?.id) return;
    removeFromCartMutation.mutate({ customerId: customer.id, productId: confirmationDialog.productId });
    setConfirmationDialog({ open: false, productId: "", productName: "" });
  };

  const cancelRemoveFromCart = () => {
    setConfirmationDialog({ open: false, productId: "", productName: "" });
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  return (
    <div className="flex-1">
      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[1300] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
          onClick={handleCloseModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full text-white border-2 border-white/20 hover:border-white/40 transition-colors"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            >
              <X className="w-4 h-4" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Product"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              />
            )}
          </div>
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      {confirmationDialog.open && (
        <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-[8px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] w-full max-w-sm">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f0f0f0]">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="font-semibold text-red-600 text-base">Remove Item from Cart</span>
            </div>
            <div className="px-6 py-4">
              <p className="text-[#333] text-sm">
                Are you sure you want to remove <strong>"{confirmationDialog.productName}"</strong> from your cart?
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-3">
              <button
                onClick={cancelRemoveFromCart}
                className="border border-[#666] text-[#666] hover:border-[#333] hover:bg-black/5 px-6 py-1.5 text-sm font-medium rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveFromCart}
                disabled={removeFromCartMutation.isPending}
                className="bg-red-600 hover:bg-red-700 disabled:bg-[#ccc] text-white px-6 py-1.5 text-sm font-medium rounded transition-colors"
              >
                {removeFromCartMutation.isPending ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Items Table */}
      <div className="bg-white rounded mb-3 overflow-x-auto">
        <table className="w-full border-separate" style={{ borderSpacing: "0 8px" }}>
          <thead>
            <tr>
              {["Item", "Price / Kg", "Quantity", "Subtotal", "Action"].map((h, i) => (
                <th
                  key={h}
                  className={`font-semibold text-[#333] text-sm py-3 border-b border-[rgba(234,104,36,1)] bg-transparent ${i === 1 || i === 2 ? "text-center" : i === 3 ? "text-right" : i === 4 ? "text-center" : "text-left"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cartItems?.map((item) => (
              <tr key={item.product?._id}>
                {/* Item */}
                <td className="py-3 bg-[#fafafa] rounded-tl-[20px] rounded-bl-[20px]">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-[60px] h-[60px] bg-[#ffa500] rounded flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => item?.product?.bannerImage && handleImageClick(item.product.bannerImage)}
                    >
                      {item?.product?.bannerImage ? (
                        <img src={item.product.bannerImage} alt={item?.productName || "Product"} className="w-full h-full object-cover rounded" />
                      ) : (
                        <span className="text-white text-xs font-semibold">No Image</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#333] text-sm mb-0.5">{item.productName}</p>
                      <p className="text-[#666] text-xs">Product ID: {item?.product?.uniqueId || item.product?._id}</p>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="py-3 bg-[#fafafa] text-center">
                  <span className="font-semibold text-[#333] text-sm">${item.productPrice.toFixed(2)}</span>
                </td>

                {/* Quantity */}
                <td className="py-3 bg-[#fafafa] text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="w-6 h-6 border border-[#ddd] rounded-full flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <div className="mx-1 text-center min-w-[40px]">
                      <span className="font-semibold text-[#333] text-sm">{item.quantity}</span>
                    </div>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-6 h-6 border border-[#ddd] rounded-full flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* Subtotal */}
                <td className="py-3 bg-[#fafafa] text-right">
                  <span className="font-semibold text-[#333] text-sm">${(item.productPrice * item.quantity).toFixed(2)}</span>
                </td>

                {/* Action */}
                <td className="py-3 bg-[#fafafa] text-center rounded-tr-[20px] rounded-br-[20px]">
                  <button
                    onClick={() => handleRemoveFromCart(item.product._id, item.productName)}
                    className="text-red-500 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-full transition-colors mx-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center my-4">
        <a href="/checkout" className="bg-[#F9A922] hover:bg-[#E8981F] text-white px-8 py-2 text-sm font-semibold rounded transition-colors">
          CheckOut
        </a>
      </div>
    </div>
  );
};

export default CartItems;
