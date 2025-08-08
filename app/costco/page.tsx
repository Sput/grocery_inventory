"use client";

import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function CostcoPage() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (session) fetchItems();
  }, [session]);

  async function fetchItems() {
    const { data } = await supabase
      .from('costco')
      .select('items')
      .is('is_deleted', null);
    setItems(data ? data.map((r) => r.items) : []);
  }

  if (!session) {
    return (
      <main className="p-4">
        <p className="text-red-600">⛔ You must log in to access this page.</p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Costco List</h1>
      {items.length > 0 ? (
        <ul className="list-disc pl-5">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No items found in the Costco table.</p>
      )}
    </main>
  );
}
