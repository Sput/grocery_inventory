"use client";

import { ReactNode } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabaseClient';
import { AuthButton } from '@/lib/auth';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <header className="bg-gray-100 p-4 flex justify-between">
        <nav className="space-x-4">
          <a href="/" className="text-gray-700 hover:underline">
            Home
          </a>
          <a href="/impromptu" className="text-gray-700 hover:underline">
            Impromptu
          </a>
          <a href="/after-costco" className="text-gray-700 hover:underline">
            After Costco
          </a>
          <a href="/manage-inventory" className="text-gray-700 hover:underline">
            Manage Inventory
          </a>
          <a href="/costco" className="text-gray-700 hover:underline">
            Costco
          </a>
          <a href="/harris-teeter" className="text-gray-700 hover:underline">
            Harris Teeter
          </a>
          <a href="/meals" className="text-gray-700 hover:underline">
            Meals
          </a>
          <a href="/inventory" className="text-gray-700 hover:underline">
            Inventory
          </a>
          <a href="/change-password" className="text-gray-700 hover:underline">
            Change Password
          </a>
          <a href="/meals" className="text-gray-700 hover:underline">
            Meals
          </a>
        </nav>
        <AuthButton />
      </header>
      {children}
    </SessionContextProvider>
  );
}
