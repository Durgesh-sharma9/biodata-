import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import { getSettings, addSettingItem, removeSettingItem } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FIELDS = [
  { key: 'positions', label: 'Positions' },
  { key: 'subjects', label: 'Subjects' },
  { key: 'qualifications', label: 'Qualifications' },
  { key: 'classes', label: 'Classes' },
];

function SettingsSection({ field, label, items, onAdd, onRemove, isPending }) {
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (!newValue.trim()) return;
    onAdd(field, newValue.trim());
    setNewValue('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder={`Add new ${label.toLowerCase().slice(0, -1)}`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          />
          <Button onClick={handleAdd} disabled={isPending || !newValue.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items?.map((item) => (
            <Badge key={item} variant="secondary" className="gap-1 py-1.5 pl-3 pr-1">
              {item}
              <button
                type="button"
                onClick={() => onRemove(field, item)}
                className="rounded-full p-0.5 hover:bg-muted"
                disabled={isPending}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
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
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }

  const isPending = addMutation.isPending || removeMutation.isPending;

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage school-specific positions, subjects, qualifications, and classes"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {FIELDS.map(({ key, label }) => (
          <SettingsSection
            key={key}
            field={key}
            label={label}
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
