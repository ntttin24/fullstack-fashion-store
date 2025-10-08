'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Cart from './Cart';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return null;
  }

  return (
    <>
      <Header />
      <Cart />
    </>
  );
}


