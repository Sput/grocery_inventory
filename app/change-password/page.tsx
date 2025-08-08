"use client";

import { useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChangePasswordPage() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <main className="p-4">
        <p className="text-red-600">⛔ You must log in to change your password.</p>
      </main>
    );
  }

  async function handleChange() {
    setMessage(null);
    if (!password || password !== confirmPassword) {
      setMessage('Passwords must match and not be empty.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Password updated successfully.');
      setPassword('');
      setConfirmPassword('');
    }
  }

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
      <div className="mb-4">
        <label className="block mb-1">New Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Confirm New Password</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full"
        />
      </div>
      <Button onClick={handleChange} disabled={loading} className="w-full">
        {loading ? 'Updating...' : 'Update Password'}
      </Button>
      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </main>
  );
}
