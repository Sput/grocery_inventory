"use client";

import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function CostcoPage() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [zones, setZones] = useState<Record<number, string[]>>({});
  const [impromptu, setImpromptu] = useState<string[]>([]);

  useEffect(() => {
    if (session) fetchItems();
  }, [session]);

  async function fetchItems() {
    const { data: costcoItems, error: costcoError } = await supabase
      .from('costco')
      .select('items')
      .is('is_deleted', null);

    if (costcoError) {
      console.error('Failed to load Costco items:', costcoError);
      setZones({});
      setImpromptu([]);
      return;
    }

    const { data: itemZones, error: itemsError } = await supabase
      .from('items')
      .select('name, zone');

    if (itemsError) {
      console.error('Failed to load item zones:', itemsError);
      setZones({});
      setImpromptu([]);
      return;
    }

    const { data: impromptuItems, error: impromptuError } = await supabase
      .from('impromptu_list')
      .select('name')
      .is('is_deleted', null);

    if (impromptuError) {
      console.error('Failed to load impromptu items:', impromptuError);
      setZones({});
      setImpromptu([]);
      return;
    }

    const zoneByName = new Map((itemZones ?? []).map((row) => [row.name.trim(), row.zone]));

    const groupedZones: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [] };
    const impromptuZoneItems: string[] = [];

    (costcoItems ?? []).forEach((row) => {
      const itemName = row.items.trim();
      const zone = zoneByName.get(itemName);
      if (zone === 1 || zone === 2 || zone === 3 || zone === 4) {
        groupedZones[zone].push(itemName);
      } else {
        impromptuZoneItems.push(itemName);
      }
    });

    (impromptuItems ?? []).forEach((row) => {
      const itemName = row.name.trim();
      const zone = zoneByName.get(itemName);
      if (zone === 1 || zone === 2 || zone === 3 || zone === 4) {
        groupedZones[zone].push(itemName);
      } else {
        impromptuZoneItems.push(itemName);
      }
    });

    setZones(groupedZones);
    setImpromptu(impromptuZoneItems);
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
      {[1, 2, 3, 4].map((zone) => (
        <section key={zone} className="mb-4">
          <h2 className="font-semibold mb-2">Zone {zone}</h2>
          {zones[zone]?.length ? (
            <ul className="list-disc pl-5">
              {zones[zone].map((item, idx) => (
                <li key={`${zone}-${idx}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No items in this zone.</p>
          )}
        </section>
      ))}

      <section className="mb-4">
        <h2 className="font-semibold mb-2">Impromptu</h2>
        {impromptu.length > 0 ? (
          <ul className="list-disc pl-5">
            {impromptu.map((item, idx) => (
              <li key={`impromptu-${idx}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No impromptu items found.</p>
        )}
      </section>
    </main>
  );
}
