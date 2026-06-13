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
  { key: 'positions', label: 'Positions', icon: Briefcase, color: 'from-blue-500 to-indigo-600', badgeStyle: 'bg-blue-500/5 text-blue-600 border-blue-200/50 hover:bg-blue-500/10' },
  { key: 'subjects', label: 'Subjects', icon: BookOpen, color: 'from-purple-500 to-pink-600', badgeStyle: 'bg-purple-500/5 text-purple-600 border-purple-200/50 hover:bg-purple-500/10' },
  { key: 'qualifications', label: 'Qualifications', icon: GraduationCap, color: 'from-cyan-500 to-blue-600', badgeStyle: 'bg-cyan-500/5 text-cyan-600 border-cyan-200/50 hover:bg-cyan-500/10' },
  { key: 'classes', label: 'Classes', icon: Layers, color: 'from-amber-500 to-orange-600', badgeStyle: 'bg-amber-500/5 text-amber-600 border-amber-200/50 hover:bg-amber-500/10' },
];

function SettingsSection({ field, label, items, onAdd, onRemove, isPending, icon: Icon, color, badgeStyle }) {
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (!newValue.trim()) return;
    onAdd(field, newValue.trim());
    setNewValue('');
  };

  return (
    <Card className="border-slate-200/70 shadow-md shadow-slate-100/50 rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:shadow-lg group">
      {/* Decorative Gradient Accent Strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
      
      <CardHeader className="pb-3 pt-6 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 bg-gradient-to-tr ${color} text-white rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}>
            <Icon className="h-4 w-4" />
          </div>
          <CardTitle className="text-base font-bold text-slate-800 tracking-tight">{label}</CardTitle>
        </div>
        <Badge variant="outline" className="text-[10px] font-bold text-slate-400 bg-slate-50 border-slate-200 px-2 py-0.5 rounded-lg">
          {items?.length || 0} Total
        </Badge>
      </CardHeader>

      <CardContent className="p-6 pt-2 space-y-5">
        {/* Dynamic Form Control Node */}
        <div className="flex gap-2 relative group/input">
          <Input
            placeholder={`Add new ${label.toLowerCase().slice(0, -1)}...`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            className="h-11 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 rounded-xl transition-all placeholder:text-slate-400 font-medium text-sm shadow-inner"
          />
          <Button 
            onClick={handleAdd} 
            disabled={isPending || !newValue.trim()}
            className={`h-11 w-11 shrink-0 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-md active:scale-95 disabled:opacity-40 p-0 flex items-center justify-center`}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
          </Button>
        </div>

        {/* Badges Display Cloud Layout */}
        <div className="min-h-[76px] p-4 bg-slate-50/50 border border-slate-100 rounded-xl flex flex-wrap gap-2 items-start transition-colors group-hover:bg-slate-50/80">
          {!items || items.length === 0 ? (
            <div className="text-xs font-medium text-slate-400/80 italic py-4 w-full text-center">
              No list metrics configured. Define parameters above.
            </div>
          ) : (
            items.map((item) => (
              <Badge 
                key={item} 
                className={`gap-1.5 py-1.5 pl-3.5 pr-1 text-xs font-semibold rounded-xl border transition-all duration-200 ${badgeStyle} group/badge`}
              >
                <span className="tracking-tight">{item}</span>
                <button
                  type="button"
                  onClick={() => onRemove(field, item)}
                  className="rounded-lg p-0.5 hover:bg-white hover:text-rose-600 hover:shadow-sm transition-all disabled:opacity-40"
                  disabled={isPending}
                >
                  <X className="h-3 w-3 stroke-[2.5]" />
                </button>
              </Badge>
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
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 antialiased">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin relative z-10" />
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse scale-150" />
        </div>
        <p className="text-slate-400 font-bold tracking-wide text-xs animate-pulse">
          Synchronizing workspace configurations...
        </p>
      </div>
    );
  }

  const isPending = addMutation.isPending || removeMutation.isPending;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 antialiased text-slate-800">
      
      {/* Redesigned Premium Title Container Block */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 shadow-xl border border-slate-800/50 group">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Sliders className="h-6 w-6 text-indigo-400" /> System Configurations
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-medium">
              Manage taxonomies across positions, subjects, classifications, and regulatory credentials.
            </p>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Core Engine Engine
          </div>
        </div>
      </div>

      {/* Grid Allocation Layout System */}
      <div className="grid gap-6 md:grid-cols-2">
        {FIELDS.map(({ key, label, icon, color, badgeStyle }) => (
          <SettingsSection
            key={key}
            field={key}
            label={label}
            icon={icon}
            color={color}
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