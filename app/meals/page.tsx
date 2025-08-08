"use client";

import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MealsPage() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [meals, setMeals] = useState<{ meal: string; last_eaten: string }[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState('');
  const [message, setMessage] = useState('');
  const [newMeal, setNewMeal] = useState('');
  const [addMsg, setAddMsg] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchOptions();
      fetchMeals();
    }
  }, [session]);

  async function fetchOptions() {
    const { data } = await supabase.from('meals').select('meal');
    setOptions(data ? data.map((r) => r.meal) : []);
    if (data && data.length > 0) setSelected(data[0].meal);
  }

  async function fetchMeals() {
    const { data } = await supabase.from('meals').select('meal, last_eaten').order('last_eaten');
    setMeals(data || []);
  }

  async function handleDinner() {
    setMessage('');
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('meals')
      .update({ last_eaten: today })
      .eq('meal', selected);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(`Marked '${selected}' as eaten today.`);
      fetchMeals();
    }
  }

  // Create new meal
  async function handleAddMeal() {
    setAddMsg(null);
    if (!newMeal.trim()) {
      setAddMsg('Meal name cannot be empty');
      return;
    }
    const { error } = await supabase.from('meals').insert({ meal: newMeal.trim() });
    if (error) setAddMsg(`Error: ${error.message}`);
    else {
      setAddMsg('Meal added');
      setNewMeal('');
      fetchOptions(); fetchMeals();
    }
  }

  // Delete a meal
  async function handleDeleteMeal(meal: string) {
    const { error } = await supabase.from('meals').delete().eq('meal', meal);
    if (error) setMessage(`Delete error: ${error.message}`);
    else fetchOptions(), fetchMeals();
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
      <h1 className="text-2xl font-bold mb-4">Meals</h1>
      {/* Add new meal */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Meal</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Meal name"
            value={newMeal}
            onChange={(e) => setNewMeal(e.target.value)}
          />
          <Button onClick={handleAddMeal}>Add</Button>
        </div>
        {addMsg && <p className="mt-2 text-sm text-gray-600">{addMsg}</p>}
      </div>
      <div className="mb-4">
        <label className="block mb-2">Enter the meal you made for dinner tonight</label>
        <select
          className="w-full border px-2 py-1"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {options.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleDinner}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Dinner
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}

      <h2 className="text-xl font-semibold mt-6 mb-2">Meals Sorted by Last Eaten</h2>
      {meals.length > 0 ? (
        <ul className="space-y-2">
          {meals.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span>
                {item.meal}, Last Eaten: {item.last_eaten}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteMeal(item.meal)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No meals found in the meals table.</p>
      )}
    </main>
  );
}
