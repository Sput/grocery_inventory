"use client";

import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

export function AuthButton() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return session ? (
    <button onClick={handleSignOut} className="text-blue-600">
      Sign Out
    </button>
  ) : (
    <Link href="/login" className="text-blue-600">
      Sign In
    </Link>
  );
}
