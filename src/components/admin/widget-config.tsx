'use client';

import React, { useState } from 'react';
import { Settings, X, GripVertical, Eye, EyeOff } from 'lucide-react';
import { useWidgets, WidgetId } from '@/context/widget-context';

export function WidgetConfig() {
  const { widgets, toggleWidget, resetWidgets } = useWidgets();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg transition-colors"
        title="Personnaliser le tableau de bord"
        style={{
          color: 'var(--text-secondary)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
        }}
      >
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-xl shadow-xl max-w-sm w-full mx-4"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
            }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                Personnaliser le tableau de bord
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Widgets list */}
            <div className="px-5 py-4 space-y-2">
              {widgets
                .sort((a, b) => a.order - b.order)
                .map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                      background: 'var(--bg-surface-hover)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <span className="text-[13.5px] font-medium" style={{ color: 'var(--text-primary)' }}>
                        {widget.title}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleWidget(widget.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: widget.visible ? 'var(--success)' : 'var(--text-muted)' }}
                      title={widget.visible ? 'Masquer' : 'Afficher'}
                    >
                      {widget.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <button
                onClick={resetWidgets}
                className="px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors"
                style={{
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-default)',
                }}
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-colors"
                style={{ background: 'var(--brand-primary)' }}
              >
                Terminé
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
