import { cookies } from 'next/headers';
import { getProducts, getAboutText } from '@/lib/db';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('timberluxe_admin_session');
  const isAuthenticated = session?.value === 'true';

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Load initial data for dashboard
  const products = await getProducts();
  const aboutText = await getAboutText();

  return (
    <AdminDashboardClient 
      initialProducts={products} 
      initialAboutText={aboutText} 
    />
  );
}

// Minimal, elegant Server-Side Login shell that mounts client-side password verification
function AdminLogin() {
  return (
    <div className="min-h-screen w-full bg-[#121214] flex items-center justify-center p-6 text-stone-300 font-sans">
      <div className="max-w-md w-full border border-stone-800 bg-[#161619] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center">
          <span className="font-serif tracking-[0.25em] text-lg font-bold text-stone-200 mb-2">
            TIMBERLUXE
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold mb-8">
            ADMIN PORTAL
          </span>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}

// Client Component form for input handling
import LoginForm from './LoginForm';
