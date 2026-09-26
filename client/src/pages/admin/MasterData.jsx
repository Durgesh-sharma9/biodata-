import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Edit2, Trash2, Search, Layers, FileText, Bookmark, GraduationCap, CheckCircle, HelpCircle, Loader2, Sliders, Check, Tag, RotateCcw } from 'lucide-react';
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
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('checkbox');
  const [newFieldOptionsList, setNewFieldOptionsList] = useState([]);
  const [currentOptionInput, setCurrentOptionInput] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [fieldConfigError, setFieldConfigError] = useState('');

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
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
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
    setEditingFieldIndex(null);
    setNewFieldLabel('');
    setNewFieldType('checkbox');
    setNewFieldOptionsList([]);
    setCurrentOptionInput('');
    setNewFieldRequired(false);
  };

  const handleStartEditField = (index) => {
    const f = positionFields[index];
    if (!f) return;
    setEditingFieldIndex(index);
    setNewFieldLabel(f.label || '');
    setNewFieldType(f.type || 'checkbox');
    setNewFieldOptionsList(Array.isArray(f.options) ? [...f.options] : []);
    setCurrentOptionInput('');
    setNewFieldRequired(Boolean(f.required));
  };

  const handleCancelEditField = () => {
    setEditingFieldIndex(null);
    setNewFieldLabel('');
    setNewFieldType('checkbox');
    setNewFieldOptionsList([]);
    setCurrentOptionInput('');
    setNewFieldRequired(false);
    setFieldConfigError('');
  };

  const handleAddOptionChip = () => {
    if (!currentOptionInput.trim()) return;
    const splitOptions = currentOptionInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const merged = [...newFieldOptionsList];
    for (const opt of splitOptions) {
      if (!merged.includes(opt)) {
        merged.push(opt);
      }
    }
    setNewFieldOptionsList(merged);
    setCurrentOptionInput('');
    setFieldConfigError('');
  };

  const handleRemoveOptionChip = (chipIdx) => {
    setNewFieldOptionsList(newFieldOptionsList.filter((_, i) => i !== chipIdx));
  };

  const handleSaveFieldToList = () => {
    if (!newFieldLabel.trim()) return;

    const needsOptions = ['select', 'multi-select', 'radio'].includes(newFieldType);
    let finalOptions = [...newFieldOptionsList];
    if (needsOptions && currentOptionInput.trim()) {
      const splitOptions = currentOptionInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const opt of splitOptions) {
        if (!finalOptions.includes(opt)) finalOptions.push(opt);
      }
    }

    if (needsOptions && finalOptions.length === 0) {
      setFieldConfigError('Please add at least one option for this dropdown / selection field (type an option and click "+ Add Option").');
      return;
    }
    setFieldConfigError('');

    if (editingFieldIndex !== null) {
      const updated = [...positionFields];
      const existing = updated[editingFieldIndex];
      updated[editingFieldIndex] = {
        ...existing,
        label: newFieldLabel.trim(),
        type: newFieldType,
        options: needsOptions ? finalOptions : [],
        required: newFieldRequired,
      };
      setPositionFields(updated);
      handleCancelEditField();
    } else {
      let fieldName = newFieldLabel
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
        .replace(/[^a-zA-Z0-9]/g, '');

      if (!fieldName) {
        fieldName = `field_${Date.now()}`;
      }

      let uniqueName = fieldName;
      let counter = 1;
      while (positionFields.some((f) => f.name === uniqueName)) {
        uniqueName = `${fieldName}_${counter++}`;
      }

      const updated = [
        ...positionFields,
        {
          name: uniqueName,
          label: newFieldLabel.trim(),
          type: newFieldType,
          options: needsOptions ? finalOptions : [],
          required: newFieldRequired,
        },
      ];
      setPositionFields(updated);
      handleCancelEditField();
    }
  };

  const handleRemoveFieldFromPosition = (index) => {
    if (editingFieldIndex === index) {
      handleCancelEditField();
    }
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
        <DialogContent className="max-w-md rounded-2xl border border-slate-200/80 bg-white p-0 dark:bg-slate-900 shadow-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200">
              Update {tab.label.slice(0, -1)} Name
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
              Modify the title parameter for this {tab.label.toLowerCase().slice(0, -1)}.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="py-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {tab.label.slice(0, -1)} Name *
              </Label>
              <Input
                value={editItem?.name || ''}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                className="h-11 border-slate-200 rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm focus-visible:ring-purple-600"
                placeholder={`Enter ${tab.label.toLowerCase().slice(0, -1)} name...`}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                autoFocus
              />
            </div>
          </DialogBody>
          <DialogFooter className="flex gap-2">
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
        <DialogContent className="max-w-lg rounded-2xl border border-slate-200/80 bg-white p-0 dark:bg-slate-900 shadow-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-600" />
              Configure Form Fields for "{fieldsModalPosition?.name}"
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
              Add or remove dynamic fields for this role. Changes will automatically reflect on all school recruitment forms.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="py-5 space-y-4">
            
            {/* Existing Fields List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Configured Fields ({positionFields.length})
                </Label>
                {editingFieldIndex !== null && (
                  <span className="text-xs text-amber-600 font-semibold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                    <Edit2 className="h-3 w-3" /> Editing Field #{editingFieldIndex + 1}
                  </span>
                )}
              </div>

              {positionFields.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  No fields configured yet. Add your first field below!
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {positionFields.map((field, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all ${
                        editingFieldIndex === idx
                          ? 'border-purple-300 bg-purple-50/70 shadow-xs ring-2 ring-purple-500/20'
                          : 'border-slate-200/80 bg-slate-50/60 dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                              {field.label}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100/70 text-purple-700 capitalize border border-purple-200/60">
                              {field.type}
                            </span>
                            {field.required && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200/60">
                                Required
                              </span>
                            )}
                          </div>

                          {/* Options pills if select / multi-select / radio */}
                          {field.options && field.options.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {field.options.map((opt, oIdx) => (
                                <span
                                  key={oIdx}
                                  className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 text-slate-600 dark:text-slate-300"
                                >
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStartEditField(idx)}
                            className="h-7 w-7 text-purple-600 hover:bg-purple-100 rounded-lg"
                            title="Edit this field & options"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFieldFromPosition(idx)}
                            className="h-7 w-7 text-rose-500 hover:bg-rose-100 rounded-lg"
                            title="Delete field"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add / Edit Field Box */}
            <div className="p-4 rounded-xl border border-purple-200/70 bg-purple-50/40 space-y-3.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  {editingFieldIndex !== null ? (
                    <>
                      <Edit2 className="h-3.5 w-3.5 text-purple-600" />
                      <span>Edit Field Properties</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5 text-purple-600" />
                      <span>Add New Field</span>
                    </>
                  )}
                </Label>
                {editingFieldIndex !== null && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEditField}
                    className="h-6 px-2 text-[11px] text-slate-500 hover:text-slate-700"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Field Label *</Label>
                  <Input
                    placeholder="e.g. Subjects, Heavy License, Shift"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    className="h-9 text-xs bg-white border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Input Type *</Label>
                  <Select value={newFieldType} onValueChange={setNewFieldType}>
                    <SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="checkbox">Checkbox (Yes / No toggle)</SelectItem>
                      <SelectItem value="select">Dropdown Select (Single choice)</SelectItem>
                      <SelectItem value="multi-select">Multi-Select Dropdown (Multiple choices)</SelectItem>
                      <SelectItem value="radio">Radio Buttons (Single choice pills)</SelectItem>
                      <SelectItem value="text">Text Input (Short single line)</SelectItem>
                      <SelectItem value="textarea">Textarea (Multi-line / Detailed)</SelectItem>
                      <SelectItem value="number">Number Input (Years, Amount, Count)</SelectItem>
                      <SelectItem value="date">Date Picker (Calendar date)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mandatory checkbox */}
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none pt-0.5">
                <input
                  type="checkbox"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 accent-purple-600"
                />
                <span>Mark this field as Mandatory (Required)</span>
              </label>

              {/* Interactive Options Tag Builder for select, multi-select, and radio */}
              {['select', 'multi-select', 'radio'].includes(newFieldType) && (
                <div className="space-y-2 pt-1 p-3 rounded-lg bg-white border border-purple-100 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-bold text-purple-900">
                      Dropdown Options ({newFieldOptionsList.length}) *
                    </Label>
                    <span className="text-[10px] text-slate-400">Type & press Enter or comma</span>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Type option name (e.g. CBSE or Van, Bus) and click Add..."
                      value={currentOptionInput}
                      onChange={(e) => setCurrentOptionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOptionChip();
                        }
                      }}
                      className="h-8 text-xs bg-white border-slate-200 rounded-lg"
                    />
                    <Button
                      type="button"
                      onClick={handleAddOptionChip}
                      disabled={!currentOptionInput.trim()}
                      className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shrink-0 flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Option</span>
                    </Button>
                  </div>

                  {/* Render chips of added options */}
                  {newFieldOptionsList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-h-28 overflow-y-auto">
                      {newFieldOptionsList.map((opt, chipIdx) => (
                        <span
                          key={chipIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 border border-purple-200 text-purple-700 shadow-2xs group"
                        >
                          <span>{opt}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionChip(chipIdx)}
                            className="text-purple-400 hover:text-rose-500 rounded-full p-0.5 transition-colors"
                            title="Remove option"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200/60 font-medium">
                      ⚠️ Please add at least one option (type name above and click "Add Option").
                    </p>
                  )}
                </div>
              )}

              {fieldConfigError && (
                <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
                  <span>{fieldConfigError}</span>
                  <button type="button" onClick={() => setFieldConfigError('')} className="font-bold text-rose-500 hover:text-rose-700">✕</button>
                </div>
              )}

              <Button
                type="button"
                onClick={handleSaveFieldToList}
                disabled={!newFieldLabel.trim()}
                className="w-full h-9 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5"
              >
                {editingFieldIndex !== null ? (
                  <>
                    <Check className="h-4 w-4 stroke-[2.5]" />
                    <span>Update Field in List</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Add Field To List</span>
                  </>
                )}
              </Button>
            </div>

          </DialogBody>
          <DialogFooter className="flex gap-2">
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