import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Sliders, Briefcase, BookOpen, GraduationCap, Layers, Loader2, Sparkles } from 'lucide-react';
import { getSettings, addSettingItem, removeSettingItem } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FIELDS = [
  { key: 'positions', label: 'Positions', icon: Briefcase, badgeStyle: 'border-cyan-200/60 bg-cyan-50/80 text-cyan-700' },
  { key: 'subjects', label: 'Subjects', icon: BookOpen, badgeStyle: 'border-indigo-200/60 bg-indigo-50/80 text-indigo-700' },
  { key: 'qualifications', label: 'Qualifications', icon: GraduationCap, badgeStyle: 'border-purple-200/60 bg-purple-50/80 text-purple-700' },
  { key: 'classes', label: 'Classes', icon: Layers, badgeStyle: 'border-emerald-200/60 bg-emerald-50/80 text-emerald-700' },
];

function SettingsSection({ field, label, items, onAdd, onRemove, isPending, icon: Icon, badgeStyle }) {
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (!newValue.trim()) return;
    onAdd(field, newValue.trim());
    setNewValue('');
  };

  return (
    <Card>
      <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 border border-purple-200/60 bg-purple-50/80 text-purple-700 rounded-xl">
            <Icon className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">{label}</CardTitle>
        </div>
        <div className="border border-slate-200/60 bg-slate-50/50 text-slate-600 rounded-xl px-2.5 py-0.5 text-[11px] font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          {items?.length || 0} Total
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-4">
        {/* Input Control Node */}
        <div className="flex gap-2">
          <Input
            placeholder={`Add new ${label.toLowerCase().slice(0, -1)}...`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl transition-all placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-purple-600 focus-visible:border-purple-200/60 dark:bg-slate-950 dark:border-slate-800"
          />
          <Button 
            onClick={handleAdd} 
            disabled={isPending || !newValue.trim()}
            className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all p-0 flex items-center justify-center disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Badges Display Cloud Layout */}
        <div className="min-h-[76px] p-4 bg-slate-50/50 border border-slate-100 rounded-xl flex flex-wrap gap-2 items-start dark:bg-slate-950/50 dark:border-slate-800">
          {!items || items.length === 0 ? (
            <div className="text-xs font-medium text-slate-400 dark:text-slate-500 italic py-4 w-full text-center">
              No list metrics configured. Define parameters above.
            </div>
          ) : (
            items.map((item) => (
              <span 
                key={item} 
                className={`inline-flex items-center gap-1.5 py-1 pl-3 pr-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${badgeStyle}`}
              >
                <span className="tracking-tight">{item}</span>
                <button
                  type="button"
                  onClick={() => onRemove(field, item)}
                  className="rounded-md p-0.5 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all disabled:opacity-40"
                  disabled={isPending}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Settings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const addMutation = useMutation({
    mutationFn: addSettingItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  const removeMutation = useMutation({
    mutationFn: removeSettingItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 antialiased bg-slate-50/50 dark:bg-slate-950">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-purple-600 animate-spin relative z-10" />
          <div className="absolute inset-0 bg-purple-100 rounded-full blur-xl animate-pulse scale-150" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-bold tracking-wide text-xs">
          Synchronizing workspace configurations...
        </p>
      </div>
    );
  }

  const isPending = addMutation.isPending || removeMutation.isPending;

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-slate-200">
      
      {/* Page Header Panel Layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/60 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <Sliders className="h-5 w-5 text-purple-600" /> System Configurations
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Manage taxonomies across positions, subjects, classifications, and regulatory credentials.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-200/60 bg-purple-50/80 text-purple-700 text-[11px] font-bold uppercase tracking-wider self-start md:self-auto">
          <Sparkles className="h-3 w-3" /> Core Engine
        </div>
      </div>

      {/* Structural Layout Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {FIELDS.map(({ key, label, icon, badgeStyle }) => (
          <SettingsSection
            key={key}
            field={key}
            label={label}
            icon={icon}
            badgeStyle={badgeStyle}
            items={settings?.[key]}
            isPending={isPending}
            onAdd={(field, value) => addMutation.mutate({ field, value })}
            onRemove={(field, value) => removeMutation.mutate({ field, value })}
          />
        ))}
      </div>
    </div>
  );
}