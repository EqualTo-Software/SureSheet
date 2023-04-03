import { Alert, Snackbar } from '@mui/material';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

export type Toast = { type: 'error'; message: string };
export type ToastContextType = {
  pushToast: (toast: Toast) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider(properties: PropsWithChildren<{}>) {
  const toastIdRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<(Toast & { key: number }) | null>(null);

  const pushToast: ToastContextType['pushToast'] = useCallback((toast) => {
    toastIdRef.current += 1;
    setToast({ ...toast, key: toastIdRef.current });
    setOpen(true);
  }, []);

  const handleToastClose = useCallback(() => {
    setOpen(false);
  }, []);

  const value: ToastContextType = useMemo(
    () => ({
      pushToast,
    }),
    [pushToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {properties.children}
      <Snackbar key={toast?.key} open={open} autoHideDuration={5000} onClose={handleToastClose}>
        <Alert onClose={handleToastClose} severity={toast?.type} sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error('ToastProvider is required by useToast.');
  }
  return context;
}
