"use client";

import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ImpromptuPage() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (session) fetchItems();
  }, [session]);

  async function fetchItems() {
    const { data, error } = await supabase
      .from('impromptu_list')
      .select('name')
      .is('is_deleted', null);
    if (data) setItems(data.map((r) => r.name.trim()));
  }

  async function handleSubmit() {
    if (!input) return;
    await supabase.from('impromptu_list').insert({ name: input });
    setInput('');
    fetchItems();
  }

  async function handleClear() {
    await supabase.rpc('mark_all_deleted');
    await supabase.rpc('clear_all_costco');
    await supabase.rpc('clear_all_harris_teeter');
    setItems([]);
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
      <h1 className="text-2xl font-bold mb-4">Impromptu List</h1>
      {items.length > 0 ? (
        <ul className="list-disc pl-5 mb-4">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mb-4">The list is empty.</p>
      )}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Enter your text here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <Button variant="destructive" onClick={handleClear} className="mt-2">
        Clear List
      </Button>
    </main>
  );
}
