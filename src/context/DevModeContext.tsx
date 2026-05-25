import React, { createContext, useContext, useState, useEffect } from 'react';

interface DevModeContextValue {
  devModeEnabled: boolean;
  sandboxEnabled: boolean;
  setDevModeEnabled: (v: boolean) => void;
  setSandboxEnabled: (v: boolean) => void;
}

const DevModeContext = createContext<DevModeContextValue>({
  devModeEnabled: false,
  sandboxEnabled: false,
  setDevModeEnabled: () => {},
  setSandboxEnabled: () => {},
});

export function DevModeProvider({ children }: { children: React.ReactNode }) {
  const [devModeEnabled, setDevModeEnabledRaw] = useState(() => {
    try { return localStorage.getItem('onextel_dev_mode') === 'true'; } catch { return false; }
  });
  const [sandboxEnabled, setSandboxEnabledRaw] = useState(() => {
    try { return localStorage.getItem('onextel_sandbox') === 'true'; } catch { return false; }
  });

  const setDevModeEnabled = (v: boolean) => {
    setDevModeEnabledRaw(v);
    try { localStorage.setItem('onextel_dev_mode', String(v)); } catch {}
    // Turning off dev mode also turns off sandbox
    if (!v) {
      setSandboxEnabledRaw(false);
      try { localStorage.setItem('onextel_sandbox', 'false'); } catch {}
    }
  };

  const setSandboxEnabled = (v: boolean) => {
    setSandboxEnabledRaw(v);
    try { localStorage.setItem('onextel_sandbox', String(v)); } catch {}
  };

  return (
    <DevModeContext.Provider value={{ devModeEnabled, sandboxEnabled, setDevModeEnabled, setSandboxEnabled }}>
      {children}
    </DevModeContext.Provider>
  );
}

export const useDevMode = () => useContext(DevModeContext);
