"use client";

import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function ManageInventoryPage() {
  const supabase = useSupabaseClient();
  const session = useSession();
  // State for adding items
  const [locations, setLocations] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // State for updating items
  const [items, setItems] = useState<{ name: string; location: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [updatedLocation, setUpdatedLocation] = useState('');
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  // Load locations and items
  useEffect(() => {
    if (session) {
      fetchLocations();
      fetchItemsList();
    }
  }, [session]);

  async function fetchLocations() {
    const { data } = await supabase.from('location').select('location');
    setLocations(data ? data.map((r) => r.location) : []);
  }

  async function fetchItemsList() {
    const { data } = await supabase.from('items').select('name, location');
    setItems(data ?? []);
  }

  // Add new item
  async function handleAdd() {
    setMessage(null);
    if (!newItem.trim() || !newLocation) {
      setMessage('Please fill in both fields.');
      return;
    }
    const { error } = await supabase
      .from('items')
      .insert({ name: newItem.trim(), location: newLocation });
    if (error) setMessage(`Error: ${error.message}`);
    else {
      setMessage(`Added: ${newItem} at ${newLocation}`);
      setNewItem('');
      setNewLocation('');
      fetchItemsList();
    }
  }

  // Update item location
  async function handleUpdate() {
    setUpdateMsg(null);
    const { error } = await supabase
      .from('items')
      .update({ location: updatedLocation })
      .eq('name', selectedItem);
    if (error) setUpdateMsg(`Error: ${error.message}`);
    else {
      setUpdateMsg('Location updated.');
      setSelectedItem('');
      setUpdatedLocation('');
      fetchItemsList();
    }
  }

  // Add new location
  const [newLocName, setNewLocName] = useState('');
  const [newLocMsg, setNewLocMsg] = useState<string | null>(null);

  async function handleAddLocation() {
    setNewLocMsg(null);
    if (!newLocName.trim()) {
      setNewLocMsg('Location name cannot be empty');
      return;
    }
    const { error } = await supabase.from('location').insert({ location: newLocName.trim() });
    if (error) setNewLocMsg(`Error: ${error.message}`);
    else {
      setNewLocMsg('Location added');
      setNewLocName('');
      fetchLocations();
    }
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
      <h1 className="text-2xl font-bold mb-4">Manage Inventory</h1>
      {/* Add new item */}
      <div className="mb-2">
        <label className="block mb-1">Enter item name:</label>
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Select item location:</label>
        <Select
          value={newLocation}
          onValueChange={(value) => setNewLocation(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="-- choose a location --" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc, idx) => (
              <SelectItem key={idx} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleAdd}>Add Item</Button>
      {message && <p className="mt-4 text-green-600">{message}</p>}

      {/* Add new location */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Add New Location</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Location name"
            value={newLocName}
            onChange={(e) => setNewLocName(e.target.value)}
          />
          <Button onClick={handleAddLocation}>Add Location</Button>
        </div>
        {newLocMsg && <p className="mt-2 text-sm text-gray-600">{newLocMsg}</p>}
      </div>
      {/* Update existing item location */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Update Item Location</h2>
        <div className="flex gap-2 mb-4">
          <Select
            value={selectedItem || ''}
            onValueChange={(value) => setSelectedItem(value)}
          >
            <SelectTrigger className="w-1/2">
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {items.map((it, i) => (
                <SelectItem key={i} value={it.name}>
                  {it.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={updatedLocation || ''}
            onValueChange={(value) => setUpdatedLocation(value)}
          >
            <SelectTrigger className="w-1/2">
              <SelectValue placeholder="New location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc, idx) => (
                <SelectItem key={idx} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleUpdate} disabled={!selectedItem || !updatedLocation}>
          Update Location
        </Button>
        {updateMsg && <p className="mt-2 text-sm text-gray-600">{updateMsg}</p>}
      </div>
    </main>
  );
}
