import React, { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

export default function UserMenu({ user, onLogout, onOpenAccount, onOpenSettings }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current &&!ref.current.contains(e.target)) setOpen(false); };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const initials = (user?.name || user?.email || "U").split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2.5 rounded-2xl border border-zinc-200 bg-white px-2.5 py-1.5 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800">
        {user?.avatar? (
          <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-xl object-cover shadow-sm ring-1 ring-black/5" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-xs font-black text-white shadow-sm">{initials}</div>
        )}
        <div className="hidden text-left sm:block">
          <div className="text-xs font-bold leading-tight">{user?.name || "Writer"}</div>
          <div className="text- leading-tight text-zinc-500">{user?.email || "local"}</div>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition ${open? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-2xl dark:border-zinc-700 dark:bg-zinc-900/95">
          <div className="flex items-center gap-3 border-b px-3 py-2.5 dark:border-zinc-800">
            {user?.avatar? (
              <img src={user.avatar} className="h-9 w-9 rounded-lg object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-xs font-black text-white">{initials}</div>
            )}
            <div className="min-w-0">
              <div className="truncate text-sm font-bold">{user?.name || "Writer"}</div>
              <div className="truncate text-xs text-zinc-500">{user?.email}</div>
            </div>
          </div>
          <div className="p-1">
            <button onClick={() => { setOpen(false); onOpenAccount?.(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-violet-50 dark:hover:bg-zinc-800"><User className="h-4 w-4 text-zinc-500" /><span>Account</span></button>
            <button onClick={() => { setOpen(false); onOpenSettings?.(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-violet-50 dark:hover:bg-zinc-800"><Settings className="h-4 w-4 text-zinc-500" /><span>Settings</span></button>
          </div>
          <div className="mx-1 my-1 border-t dark:border-zinc-800" />
          <div className="p-1">
            <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"><LogOut className="h-4 w-4" /><span>Sign out</span></button>
          </div>
        </div>
      )}
    </div>
  );
}