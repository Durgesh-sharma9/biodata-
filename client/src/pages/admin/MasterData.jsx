import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Edit2, Trash2, Search } from 'lucide-react';
import {
  getPositionsForAdmin,
  getSubjectsForAdmin,
  getQualificationsForAdmin,
  getClassesForAdmin,
  createPosition,
  updatePosition,
  deletePosition,
  createSubject,
  updateSubject,
  deleteSubject,
  createQualification,
  updateQualification,
  deleteQualification,
  createClass,
  updateClass,
  deleteClass,
} from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TABS = [
  { id: 'positions', label: 'Positions', queryFn: getPositionsForAdmin, createFn: createPosition, updateFn: updatePosition, deleteFn: deletePosition },
  { id: 'subjects', label: 'Subjects', queryFn: getSubjectsForAdmin, createFn: createSubject, updateFn: updateSubject, deleteFn: deleteSubject },
  { id: 'qualifications', label: 'Qualifications', queryFn: getQualificationsForAdmin, createFn: createQualification, updateFn: updateQualification, deleteFn: deleteQualification },
  { id: 'classes', label: 'Classes', queryFn: getClassesForAdmin, createFn: createClass, updateFn: updateClass, deleteFn: deleteClass },
];

function MasterDataTable({ tab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['master-data', tab.id],
    queryFn: () => tab.queryFn().then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (value) => tab.createFn({ name: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-data', tab.id] });
      setNewItem('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }) => tab.updateFn(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-data', tab.id] });
      setEditItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tab.deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-data', tab.id] });
    },
  });

  const filteredData = data?.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAdd = () => {
    if (!newItem.trim()) return;
    createMutation.mutate(newItem.trim());
  };

  const handleEdit = (item) => {
    setEditItem(item);
  };

  const handleUpdate = () => {
    if (!editItem?.name?.trim()) return;
    updateMutation.mutate({
      id: editItem._id,
      name: editItem.name.trim(),
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="py-8 text-center">Loading...</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New {tab.label.slice(0, -1)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder={`Enter ${tab.label.slice(0, -1)} name`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={createMutation.isPending}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All {tab.label}</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredData.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <span className="font-medium">{item.name}</span>
                  {!item.isActive && <Badge variant="outline" className="ml-2">Inactive</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div className="text-center text-muted-foreground py-8">No {tab.label.toLowerCase()} found</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {tab.label.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editItem?.name || ''}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
              />
            </div>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending} className="w-full">
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MasterData() {
  const [activeTab, setActiveTab] = useState('positions');

  return (
    <div>
      <PageHeader
        title="Master Data Management"
        description="Manage global positions, subjects, qualifications, and classes"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <MasterDataTable tab={tab} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
