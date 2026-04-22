import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { supabase } from './../supabaseClient'; // your existing supabase client

export default function ProtectedRoute() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  if (session === undefined) return <div>Loading...</div>; // still checking
  if (!session) return <Navigate to="/login" replace />;   // not logged in → go to login
  return <Outlet />;                                        // logged in → show the page
}