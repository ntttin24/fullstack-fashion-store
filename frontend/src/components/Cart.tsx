'use client'

import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Cart() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  if (!mounted || !isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] animate-fade-in"
        onClick={toggleCart}
      />

      {/* Cart Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--card)] text-[var(--foreground)] border-l border-[color:var(--border)] shadow-xl z-[101] transform transition-transform duration-300 animate-slide-in-right flex flex-col cart-sidebar">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[color:var(--border)] bg-[var(--card)] flex-shrink-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag size={20} />
            Giỏ hàng ({items.length})
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-[color:var(--border)]/40 rounded-full transition-colors transform-gpu active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col flex-1 min-h-0">
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-[color:var(--border)]/40 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-[color:var(--muted-foreground)]" />
              </div>
              <h3 className="text-xl font-medium text-[var(--foreground)] mb-3">
                Giỏ hàng trống
              </h3>
              <p className="text-[color:var(--muted-foreground)] mb-8 max-w-xs">
                Thêm sản phẩm yêu thích vào giỏ hàng để bắt đầu mua sắm
              </p>
              <Link href="/products">
                <button 
                  onClick={toggleCart}
                  className="bg-[var(--primary)] text-[var(--primary-foreground)] px-8 py-3 rounded-lg hover:opacity-90 transition-all transform-gpu hover:scale-105 active:scale-95 font-medium"
                >
                  Khám phá sản phẩm
                </button>
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="cart-item flex gap-3 bg-[color:var(--border)]/20 p-4 rounded-xl border border-[color:var(--border)]/30 hover:bg-[color:var(--border)]/30 transition-colors">
                    {/* Product Image */}
                    <div className="cart-item-image w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-[var(--foreground)] line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[color:var(--muted-foreground)] mb-2">
                        {item.size} • {item.color}
                      </p>
                      <p className="font-semibold text-sm mb-3 text-[var(--primary)]">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[color:var(--border)] rounded-lg bg-[var(--card)]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, isAuthenticated)}
                            className="p-2 hover:bg-[color:var(--border)]/40 transition-colors transform-gpu active:scale-90"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, isAuthenticated)}
                            className="p-2 hover:bg-[color:var(--border)]/40 transition-colors transform-gpu active:scale-90"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id, isAuthenticated)}
                          className="text-red-500 hover:text-red-700 text-xs transition-colors flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-1 rounded"
                        >
                          <Trash2 size={12} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer - Fixed at bottom */}
              <div className="border-t border-[color:var(--border)] bg-[var(--card)] p-4 space-y-4 flex-shrink-0">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-bold bg-[color:var(--border)]/20 p-3 rounded-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-[var(--primary)]">{formatPrice(getTotalPrice())}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/checkout">
                    <button 
                      onClick={toggleCart}
                      className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 rounded-lg transition-all transform-gpu hover:translate-y-[-1px] hover:shadow-lg active:translate-y-0 active:scale-[0.98] font-medium"
                    >
                      Thanh toán ngay
                    </button>
                  </Link>
                  
                  <button 
                    onClick={() => clearCart(isAuthenticated)}
                    className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20 py-2.5 rounded-lg transition-all transform-gpu active:scale-[0.98] font-medium flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Xóa tất cả
                  </button>
                </div>

                {/* Continue Shopping */}
                <Link href="/products">
                  <button 
                    onClick={toggleCart}
                    className="w-full text-center text-[var(--primary)] hover:text-[var(--primary)]/80 text-sm transition-colors py-2 hover:bg-[color:var(--border)]/20 rounded-lg"
                  >
                    Tiếp tục mua sắm
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

