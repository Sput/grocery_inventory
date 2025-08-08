"use client";

import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';

export default function AfterCostcoPage() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [items, setItems] = useState<string[]>([]);
  const [choices, setChoices] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session) fetchItems();
  }, [session]);

  async function fetchItems() {
    const { data } = await supabase
      .from('costco')
      .select('items')
      .is('is_deleted', null);
    if (data) setItems(data.map((r) => r.items));
  }

  function handleChoice(idx: number, value: string) {
    setChoices((prev) => ({ ...prev, [idx]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const selected = items.filter((_, idx) => choices[idx] === 'Harris Teeter');
    await Promise.all(
      selected.map((item) =>
        supabase.from('harris_teeter').insert({ items: item })
      )
    );
    setSaving(false);
    // Optional: refresh or reset choices
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
      <h1 className="text-2xl font-bold mb-4">Shopping List</h1>
      {items.map((item, idx) => (
        <div key={idx} className="mb-2">
          <span className="mr-4">{item}</span>
          <label className="mr-2">
            <input
              type="radio"
              name={`choice_${idx}`}
              value="Have"
              checked={choices[idx] === 'Have'}
              onChange={() => handleChoice(idx, 'Have')}
              className="mr-1"
            />
            Have
          </label>
          <label>
            <input
              type="radio"
              name={`choice_${idx}`}
              value="Harris Teeter"
              checked={choices[idx] === 'Harris Teeter'}
              onChange={() => handleChoice(idx, 'Harris Teeter')}
              className="mr-1"
            />
            Harris Teeter
          </label>
        </div>
      ))}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="mt-4"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </main>
  );
}
