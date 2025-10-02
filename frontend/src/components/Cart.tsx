'use client'

import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Cart() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
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
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={toggleCart}
      />

      {/* Cart Sidebar */}
      <div className="fixed top-0 right-0 h-dvh w-full max-w-md bg-[var(--card)] text-[var(--foreground)] border-l border-[color:var(--border)] shadow-xl z-50 transform transition-transform duration-300 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[color:var(--border)]">
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
        <div className="flex flex-col h-dvh min-h-0">
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-[color:var(--border)]/40 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-[color:var(--muted-foreground)]" />
              </div>
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-[color:var(--muted-foreground)] mb-6">
                Thêm sản phẩm yêu thích vào giỏ hàng
              </p>
              <Link href="/products">
                <button 
                  onClick={toggleCart}
                  className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-2 rounded hover:opacity-90 transition-opacity"
                >
                  Khám phá sản phẩm
                </button>
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-[color:var(--border)]/30 p-3 rounded-lg">
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-[var(--foreground)] truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                        {item.size} • {item.color}
                      </p>
                      <p className="font-semibold text-sm mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[color:var(--border)] rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-[color:var(--border)]/40 transition-colors transform-gpu active:scale-90"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-[color:var(--border)]/40 transition-colors transform-gpu active:scale-90"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-xs transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-[color:var(--border)] px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link href="/checkout">
                    <button 
                      onClick={toggleCart}
                      className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 rounded transition-all transform-gpu hover:translate-y-[-1px] hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
                    >
                      Thanh toán
                    </button>
                  </Link>
                  <button 
                    onClick={clearCart}
                    className="w-full border border-[color:var(--border)] text-[color:var(--muted)] py-2 rounded transition-all hover:bg-[color:var(--border)]/40 transform-gpu active:scale-[0.98]"
                  >
                    Xóa tất cả
                  </button>
                </div>

                {/* Continue Shopping */}
                <Link href="/products">
                  <button 
                    onClick={toggleCart}
                    className="w-full text-center text-blue-500 hover:text-blue-600 text-sm transition-colors"
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

