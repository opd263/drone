'use client';

import { ReactNode, useEffect, useRef } from 'react';

export default function ConfirmDialog({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
  inline = false, // ✅ NEW
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  loading?: boolean;
  inline?: boolean; // ✅ NEW
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'Escape':
          if (!loading) onClose();
          break;
        case 'Enter':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (!loading) onConfirm();
          }
          break;
        case 'Tab':
          const focusableElements = dialogRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
          break;
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      if (!inline) document.body.style.overflow = 'hidden';
      setTimeout(() => confirmButtonRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (!inline) document.body.style.overflow = '';
    };
  }, [open, onClose, onConfirm, loading, inline]);

  // Handle backdrop click (only for fullscreen mode)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!inline && e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: '⚠️',
          confirmBg: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
          iconBg: 'bg-red-100 dark:bg-red-900/30',
          iconColor: 'text-red-600 dark:text-red-400',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'warning':
        return {
          icon: '⚠️',
          confirmBg: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        };
      case 'success':
        return {
          icon: '✅',
          confirmBg: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
          iconBg: 'bg-green-100 dark:bg-green-900/30',
          iconColor: 'text-green-600 dark:text-green-400',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      default:
        return {
          icon: '❓',
          confirmBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
    }
  };

  if (!open) return null;

  const styles = getVariantStyles();

  const wrapperClass = inline
    ? 'absolute top-full mt-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-md'
    : 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm';

  return (
    <div
      className={`${wrapperClass} animate-in fade-in duration-200`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div
        ref={dialogRef}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full mx-auto transform animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${styles.iconBg} ${styles.borderColor} border`}>
              <span className="text-2xl">{styles.icon}</span>
            </div>
            <div className="flex-1">
              <h2 id="dialog-title" className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div id="dialog-description" className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {children}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${styles.confirmBg}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>

        {/* Shortcuts hint */}
        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">ESC</kbd> to cancel
            {' • '}
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Enter</kbd> to confirm
          </p>
        </div>
      </div>
    </div>
  );
}
