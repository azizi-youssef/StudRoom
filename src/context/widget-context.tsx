'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type WidgetId = 'kpi-cards' | 'charts' | 'priority-actions' | 'recent-activity' | 'property-overview';

export interface Widget {
  id: WidgetId;
  title: string;
  visible: boolean;
  order: number;
}

interface WidgetContextType {
  widgets: Widget[];
  toggleWidget: (id: WidgetId) => void;
  reorderWidget: (id: WidgetId, newOrder: number) => void;
  resetWidgets: () => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

const DEFAULT_WIDGETS: Widget[] = [
  { id: 'kpi-cards', title: 'Indicateurs KPI', visible: true, order: 1 },
  { id: 'charts', title: 'Graphiques', visible: true, order: 2 },
  { id: 'priority-actions', title: 'Actions prioritaires', visible: true, order: 3 },
  { id: 'recent-activity', title: 'Activité récente', visible: true, order: 4 },
  { id: 'property-overview', title: 'Aperçu propriétés', visible: true, order: 5 },
];

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('studroom-dashboard-widgets');
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load widget configuration:', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('studroom-dashboard-widgets', JSON.stringify(widgets));
  }, [widgets]);

  const toggleWidget = (id: WidgetId) => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id ? { ...widget, visible: !widget.visible } : widget
      )
    );
  };

  const reorderWidget = (id: WidgetId, newOrder: number) => {
    setWidgets((prev) => {
      const widget = prev.find((w) => w.id === id);
      if (!widget) return prev;

      const otherWidget = prev.find((w) => w.order === newOrder);
      if (!otherWidget) return prev;

      return prev.map((w) => {
        if (w.id === id) return { ...w, order: newOrder };
        if (w.id === otherWidget.id) return { ...w, order: widget.order };
        return w;
      });
    });
  };

  const resetWidgets = () => {
    setWidgets(DEFAULT_WIDGETS);
  };

  return (
    <WidgetContext.Provider value={{ widgets, toggleWidget, reorderWidget, resetWidgets }}>
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidgets() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgets must be used within WidgetProvider');
  }
  return context;
}
