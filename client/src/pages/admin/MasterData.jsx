import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Edit2, Trash2, Search, Layers, FileText, Bookmark, GraduationCap, CheckCircle, HelpCircle, Loader2, Sliders } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TABS = [
  { id: 'positions', label: 'Positions', queryFn: getPositionsForAdmin, createFn: createPosition, updateFn: updatePosition, deleteFn: deletePosition, icon: Layers },
  { id: 'subjects', label: 'Subjects', queryFn: getSubjectsForAdmin, createFn: createSubject, updateFn: updateSubject, deleteFn: deleteSubject, icon: Bookmark },
  { id: 'qualifications', label: 'Qualifications', queryFn: getQualificationsForAdmin, createFn: createQualification, updateFn: updateQualification, deleteFn: deleteQualification, icon: GraduationCap },
  { id: 'classes', label: 'Classes', queryFn: getClassesForAdmin, createFn: createClass, updateFn: updateClass, deleteFn: deleteClass, icon: FileText },
];

function MasterDataTable({ tab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState('');
  
  // Custom Fields Modal state for Positions
  const [fieldsModalPosition, setFieldsModalPosition] = useState(null);
  const [positionFields, setPositionFields] = useState([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('checkbox');
  const [newFieldOptions, setNewFieldOptions] = useState('');

  const queryClient = useQueryClient();
  const TabIcon = tab.icon || Layers;

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
    mutationFn: ({ id, name, fields, isActive }) => tab.updateFn(id, { name, fields, isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-data', tab.id] });
      setEditItem(null);
      setFieldsModalPosition(null);
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

  const handleOpenFieldsModal = (positionItem) => {
    setFieldsModalPosition(positionItem);
    setPositionFields(positionItem.fields || []);
    setNewFieldLabel('');
    setNewFieldType('checkbox');
    setNewFieldOptions('');
  };

  const handleAddFieldToPosition = () => {
    if (!newFieldLabel.trim()) return;
    const fieldName = newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '');
    const optionsArray = ['select', 'multi-select'].includes(newFieldType)
      ? newFieldOptions.split(',').map((o) => o.trim()).filter(Boolean)
      : [];

    const updated = [
      ...positionFields,
      {
        name: fieldName,
        label: newFieldLabel.trim(),
        type: newFieldType,
        options: optionsArray,
      },
    ];
    setPositionFields(updated);
    setNewFieldLabel('');
    setNewFieldOptions('');
  };

  const handleRemoveFieldFromPosition = (index) => {
    setPositionFields(positionFields.filter((_, i) => i !== index));
  };

  const handleSavePositionFields = () => {
    if (!fieldsModalPosition) return;
    updateMutation.mutate({
      id: fieldsModalPosition._id,
      name: fieldsModalPosition.name,
      fields: positionFields,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200/50 dark:bg-slate-800/40 rounded-xl" />
        <div className="h-64 bg-slate-200/40 dark:bg-slate-800/30 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input Entry Card Configuration */}
      <Card className="w-full border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
            Create New {tab.label.slice(0, -1)}
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Instantly deploy a global onboarding selector attribute option for records.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="flex gap-2.5 max-w-2xl">
            <div className="relative flex-grow">
              <Input
                placeholder={`Enter ${tab.label.slice(0, -1).toLowerCase()} name...`}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm"
              />
            </div>
            <Button 
              onClick={handleAdd} 
              disabled={createMutation.isPending || !newItem.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-11 px-5 rounded-xl transition-all duration-200 shrink-0 flex items-center gap-1.5"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>Add Option</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Records Control Core Section */}
      <Card className="w-full border border-slate-200/80 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                <TabIcon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">Active Matrix Data</CardTitle>
                <CardDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium">Currently saved {tab.label.toLowerCase()} entries</CardDescription>
              </div>
            </div>
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder={`Search ${tab.label.toLowerCase()}...`}
                className="pl-10 pr-4 h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredData.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredData.map((item) => (
                <div 
                  key={item._id} 
                  className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border-b border-slate-100 dark:border-slate-800/40 last:border-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-tight truncate">
                      {item.name}
                    </span>
                    {item.isActive ?? true ? (
                      <Badge className="border-emerald-200/60 bg-emerald-50/80 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-none">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="border-rose-200/60 bg-rose-50/80 text-rose-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-none">
                        Inactive
                      </Badge>
                    )}

                    {tab.id === 'positions' && (
                      <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 text-[10px] font-bold">
                        {item.fields?.length || 0} Custom Fields
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    {tab.id === 'positions' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenFieldsModal(item)}
                        className="h-8 px-2.5 text-xs font-semibold border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center gap-1 rounded-lg"
                      >
                        <Sliders className="h-3.5 w-3.5" />
                        <span>Form Fields</span>
                      </Button>
                    )}

                    <Button 
                      variant="edit" 
                      size="icon" 
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8"
                      title="Edit Item"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="delete"
                      size="icon" 
                      onClick={() => handleDelete(item._id)}
                      className="h-8 w-8"
                      title="Delete Item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-sm mx-auto">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 mb-4 border border-slate-100 dark:border-slate-800">
                <HelpCircle className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide">No Records Located</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">
                We couldn't locate matching records for "{searchTerm || tab.label}".
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Polish Confirmation Dialog Form Box */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-md rounded-xl border border-slate-200/60 bg-white p-6 dark:bg-slate-900 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">
              Update Row Entry
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
              Refine parameters for global selection tags inside the infrastructure.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="pt-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Item Identity Title Name
              </Label>
              <Input
                value={editItem?.name || ''}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                className="h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm"
                placeholder="Modify name parameter..."
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
              />
            </div>
          </DialogBody>
          <DialogFooter className="mt-6 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setEditItem(null)}
              className="rounded-xl h-11 font-medium transition-all border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending || !editItem?.name?.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl h-11 px-5 transition-all duration-200 active:scale-95"
            >
              {updateMutation.isPending ? 'Saving...' : 'Apply Overrides'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dynamic Form Field Builder Modal for Position */}
      <Dialog open={!!fieldsModalPosition} onOpenChange={() => setFieldsModalPosition(null)}>
        <DialogContent className="max-w-lg rounded-xl border border-slate-200/60 bg-white p-6 dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-600" />
              Configure Dynamic Form Fields for "{fieldsModalPosition?.name}"
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
              Add custom checkboxes, dropdowns, or inputs for this specific position. Saved fields will automatically render on candidate forms for all school admins.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="pt-4 space-y-4">
            
            {/* Existing Fields List */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Configured Fields ({positionFields.length})</Label>
              {positionFields.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100">No custom fields added yet. Add one below!</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {positionFields.map((field, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-800 text-xs">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{field.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium capitalize">Type: {field.type} {field.options?.length ? `(${field.options.join(', ')})` : ''}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFieldFromPosition(idx)}
                        className="h-7 w-7 text-rose-500 hover:bg-rose-50 rounded-md"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Field Box */}
            <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/50 space-y-3">
              <Label className="text-xs font-bold text-purple-900 flex items-center gap-1">
                <Plus className="h-3.5 w-3.5 text-purple-600" />
                Add New Field
              </Label>
              
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label className="text-[10px] font-semibold text-slate-500">Field Label *</Label>
                  <Input
                    placeholder="e.g. Heavy License Required"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    className="h-9 text-xs bg-white border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-semibold text-slate-500">Input Type *</Label>
                  <Select value={newFieldType} onValueChange={setNewFieldType}>
                    <SelectTrigger className="h-9 text-xs bg-white border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="checkbox">Checkbox (Yes/No)</SelectItem>
                      <SelectItem value="select">Dropdown Select</SelectItem>
                      <SelectItem value="multi-select">Multi-Select Dropdown</SelectItem>
                      <SelectItem value="text">Text Input</SelectItem>
                      <SelectItem value="number">Number Input</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {['select', 'multi-select'].includes(newFieldType) && (
                <div className="space-y-1">
                  <Label className="text-[10px] font-semibold text-slate-500">Options (Comma-separated) *</Label>
                  <Input
                    placeholder="e.g. Heavy, Light, Commercial, School Bus"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    className="h-9 text-xs bg-white border-slate-200"
                  />
                </div>
              )}

              <Button
                type="button"
                onClick={handleAddFieldToPosition}
                disabled={!newFieldLabel.trim()}
                className="w-full h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
              >
                Add Field To List
              </Button>
            </div>

          </DialogBody>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setFieldsModalPosition(null)}
              className="rounded-xl h-10 font-medium text-xs border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePositionFields}
              disabled={updateMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl h-10 px-5 text-xs"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Position Fields'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default function MasterData() {
  const [activeTab, setActiveTab] = useState('positions');

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white">
      {/* Saas Layout Header Block Container */}
      <div className="border-b border-slate-200/60 dark:border-slate-800 pb-5">
        <PageHeader
          title="Master Data Management"
          description="Govern systematic parameters, structural attributes, global taxonomy indexes, and dropdown data feeds for HireHub."
        />
      </div>

      {/* Advanced Purple Theme Navigational Tabs Panel Systems */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-200/60 dark:border-slate-800 shadow-sm gap-1 w-auto max-w-full overflow-x-auto">
          {TABS.map((tab) => {
            const CurrentIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold tracking-wide transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 active:scale-[0.97]"
              >
                <CurrentIcon className={`h-3.5 w-3.5 transition-transform ${isActive ? 'scale-110 text-purple-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="outline-none focus-visible:ring-0 mt-0">
            <MasterDataTable tab={tab} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}