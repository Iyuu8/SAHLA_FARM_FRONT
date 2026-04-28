import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { supabase } from './../supabaseClient'; // your existing supabase client

export default function ProtectedRoute() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }).then((res) => {
        if (!res.ok) {
          setSession(null); // invalidate session if token is not valid
        }
      });
    });
  }, []);

  if (session === undefined) return <div h-full w-full flex items-center justify-center><h4>Loading...</h4></div>; // still checking
  if (!session) return <Navigate to="/login" replace />;   // not logged in → go to login
  return <Outlet />;                                        // logged in → show the page
}