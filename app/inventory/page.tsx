"use client";

import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { RadioGroup, Radio } from '@/components/ui/radio';

export default function InventoryPage() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [grouped, setGrouped] = useState<Record<string, string[]>>({});
  const [impromptu, setImpromptu] = useState<string[]>([]);
  const [choices, setChoices] = useState<Record<string, Record<number, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session) {
      fetchGrouped();
      fetchImpromptu();
    }
  }, [session]);

  async function fetchGrouped() {
    const { data } = await supabase.from('items').select('name, location');
    const map: Record<string, string[]> = {};
    data?.forEach((r) => {
      const loc = r.location.trim();
      if (!map[loc]) map[loc] = [];
      map[loc].push(r.name.trim());
    });
    setGrouped(map);
  }

  async function fetchImpromptu() {
    const { data } = await supabase.from('impromptu_list').select('name').is('is_deleted', null);
    setImpromptu(data ? data.map((r) => r.name.trim()) : []);
  }

  const handleChoice = (group: string, idx: number, val: string) => {
    setChoices((prev) => ({
      ...prev,
      [group]: { ...prev[group], [idx]: val },
    }));
  };

  async function handleSave() {
    setSaving(true);
    const costco: string[] = [];
    const ht: string[] = [];

    Object.entries(grouped).forEach(([loc, items]) => {
      items.forEach((item, idx) => {
        const status = choices[loc]?.[idx] || 'Have';
        if (status === 'Costco') costco.push(item);
        if (status === 'Harris Teeter') ht.push(item);
      });
    });

    impromptu.forEach((item, idx) => {
      const status = choices['Impromptu']?.[idx] || 'Have';
      if (status === 'Costco') costco.push(item);
      if (status === 'Harris Teeter') ht.push(item);
    });

    await Promise.all([
      ...costco.map((it) => supabase.from('costco').insert({ items: it })),
      ...ht.map((it) => supabase.from('harris_teeter').insert({ items: it })),
    ]);
    setSaving(false);
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
      {Object.entries(grouped).map(([loc, items]) => (
        <section key={loc} className="mb-4">
          <h2 className="font-semibold first-letter:uppercase mb-2">{loc}</h2>
          {items.map((item, idx) => (
            <div key={idx} className="mb-2 flex items-center space-x-4">
              <span className="w-32">{item}</span>
              <RadioGroup
                value={choices[loc]?.[idx] || 'Have'}
                onValueChange={(val) => handleChoice(loc, idx, val)}
                className="flex items-center space-x-3"
              >
                <div className="flex items-center space-x-1">
                  <Radio value="Have" id={`${loc}-${idx}-have`} />
                  <label htmlFor={`${loc}-${idx}-have`}>Have</label>
                </div>
                <div className="flex items-center space-x-1">
                  <Radio value="Costco" id={`${loc}-${idx}-costco`} />
                  <label htmlFor={`${loc}-${idx}-costco`}>Costco</label>
                </div>
                <div className="flex items-center space-x-1">
                  <Radio value="Harris Teeter" id={`${loc}-${idx}-ht`} />
                  <label htmlFor={`${loc}-${idx}-ht`}>Harris Teeter</label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </section>
      ))}

      <section className="mb-4">
        <h2 className="font-semibold mb-2">Impromptu List</h2>
        {impromptu.length > 0 ? (
          impromptu.map((item, idx) => (
            <div key={idx} className="mb-2 flex items-center space-x-4">
              <span className="w-32">{item}</span>
              <RadioGroup
                value={choices['Impromptu']?.[idx] || 'Have'}
                onValueChange={(val) => handleChoice('Impromptu', idx, val)}
                className="flex items-center space-x-3"
              >
                <div className="flex items-center space-x-1">
                  <Radio value="Have" id={`impromptu-${idx}-have`} />
                  <label htmlFor={`impromptu-${idx}-have`}>Have</label>
                </div>
                <div className="flex items-center space-x-1">
                  <Radio value="Costco" id={`impromptu-${idx}-costco`} />
                  <label htmlFor={`impromptu-${idx}-costco`}>Costco</label>
                </div>
                <div className="flex items-center space-x-1">
                  <Radio value="Harris Teeter" id={`impromptu-${idx}-ht`} />
                  <label htmlFor={`impromptu-${idx}-ht`}>Harris Teeter</label>
                </div>
              </RadioGroup>
            </div>
          ))
        ) : (
          <p>The impromptu list is empty.</p>
        )}
      </section>
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </main>
  );
}
