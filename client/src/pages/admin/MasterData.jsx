import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Edit2, Trash2, Search, Layers, FileText, Bookmark, GraduationCap, CheckCircle, HelpCircle, Loader2 } from 'lucide-react';
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
  DialogTrigger,
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
      <Card className="rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden">
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
                className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm"
              />
            </div>
            <Button 
              onClick={handleAdd} 
              disabled={createMutation.isPending || !newItem.trim()}
              className="bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold h-11 px-5 rounded-xl transition-all duration-200 shrink-0 flex items-center gap-1.5"
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
      <Card className="rounded-xl border-none bg-white shadow-sm dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#A05AFF]/10 text-[#A05AFF] rounded-xl">
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
                className="pl-10 pr-4 h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm"
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
                      <Badge className="border-[#1BCFB4]/30 bg-[#1BCFB4]/5 text-[#1BCFB4] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-none variant-outline">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="border-[#FE9496]/30 bg-[#FE9496]/5 text-[#FE9496] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-none variant-outline">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8 rounded-xl text-slate-400 hover:text-[#A05AFF] hover:bg-[#A05AFF]/10 transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(item._id)}
                      className="h-8 w-8 rounded-xl text-slate-400 hover:text-[#FE9496] hover:bg-[#FE9496]/10 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Soft-Tint Empty State Configuration */
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-sm mx-auto">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 mb-4 border border-slate-100 dark:border-slate-800">
                <HelpCircle className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide">No Records Located</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">
                We couldn't locate matching records for "{searchTerm || tab.label}". Try introducing a fresh record configuration variant above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Polish Confirmation Dialog Form Box */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-md rounded-xl border-none bg-white p-6 dark:bg-slate-900 shadow-sm">
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
                className="h-11 border-slate-200 rounded-xl focus-visible:ring-[#A05AFF] focus-visible:border-[#A05AFF]/50 dark:bg-slate-800 dark:border-slate-700 text-sm"
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
              className="bg-[#A05AFF] hover:bg-[#A05AFF]/90 text-white font-bold rounded-xl h-11 px-5 transition-all duration-200 active:scale-95"
            >
              {updateMutation.isPending ? 'Saving...' : 'Apply Overrides'}
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
    <div className="space-y-6 max-w-7xl mx-auto bg-[#f3f3f4] dark:bg-slate-950 text-slate-800 dark:text-white antialiased min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
      {/* Saas Layout Header Block Container */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <PageHeader
          title="Master Data Management"
          description="Govern systematic parameters, structural attributes, global taxonomy indexes, and dropdown data feeds for HireHub."
          className="text-slate-800 dark:text-white font-bold tracking-tight text-xl"
        />
      </div>

      {/* Advanced Purple Theme Navigational Tabs Panel Systems */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-200/40 dark:border-slate-800 shadow-sm gap-1 w-auto max-w-full overflow-x-auto">
          {TABS.map((tab) => {
            const CurrentIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold tracking-wide transition-all data-[state=active]:bg-[#A05AFF]/10 data-[state=active]:text-[#A05AFF] active:scale-[0.97]"
              >
                <CurrentIcon className={`h-3.5 w-3.5 transition-transform ${isActive ? 'scale-110 text-[#A05AFF]' : 'text-slate-400'}`} />
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