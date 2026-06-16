import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Edit2, Trash2, Search, Layers, FileText, Bookmark, GraduationCap, CheckCircle, HelpCircle } from 'lucide-react';
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
  { id: 'positions', label: 'Positions', queryFn: getPositionsForAdmin, createFn: createPosition, updateFn: updatePosition, deleteFn: deletePosition, icon: Layers, gradient: 'from-blue-500 to-cyan-500' },
  { id: 'subjects', label: 'Subjects', queryFn: getSubjectsForAdmin, createFn: createSubject, updateFn: updateSubject, deleteFn: deleteSubject, icon: Bookmark, gradient: 'from-indigo-500 to-purple-500' },
  { id: 'qualifications', label: 'Qualifications', queryFn: getQualificationsForAdmin, createFn: createQualification, updateFn: updateQualification, deleteFn: deleteQualification, icon: GraduationCap, gradient: 'from-purple-500 to-pink-500' },
  { id: 'classes', label: 'Classes', queryFn: getClassesForAdmin, createFn: createClass, updateFn: updateClass, deleteFn: deleteClass, icon: FileText, gradient: 'from-amber-500 to-orange-500' },
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

  // Premium Skeleton Shimmer State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-muted/40 rounded-2xl border border-muted/30" />
        <div className="h-64 bg-muted/30 rounded-2xl border border-muted/30" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input Entry Card Configuration */}
      <Card className="overflow-hidden border border-muted/60 shadow-sm transition-all duration-300 hover:shadow-md rounded-2xl relative">
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${tab.gradient}`} />
        <CardHeader className="pb-4 pl-7">
          <CardTitle className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
            Create New {tab.label.slice(0, -1)}
          </CardTitle>
          <CardDescription className="text-xs">
            Instantly deploy a global onboarding selector attribute option for records.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-7">
          <div className="flex gap-2.5 max-w-2xl">
            <div className="relative flex-grow">
              <Input
                placeholder={`Enter ${tab.label.slice(0, -1).toLowerCase()} name...`}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="rounded-xl focus-visible:ring-indigo-500 pl-4 h-11 transition-all"
              />
            </div>
            <Button 
              onClick={handleAdd} 
              disabled={createMutation.isPending || !newItem.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md h-11 px-5 rounded-xl transition-all duration-200 shrink-0 flex items-center gap-1.5 font-medium"
            >
              {createMutation.isPending ? 'Saving...' : (
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
      <Card className="rounded-2xl shadow-sm border border-muted/60 overflow-hidden bg-background">
        <CardHeader className="border-b border-muted/40 bg-slate-50/50 dark:bg-slate-900/10 pb-5 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 bg-gradient-to-br ${tab.gradient} text-white rounded-xl shadow-sm`}>
                <TabIcon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold tracking-tight">Active Matrix Data</CardTitle>
                <CardDescription className="text-xs">Currently saved {tab.label.toLowerCase()} entries</CardDescription>
              </div>
            </div>
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/70" />
              <Input
                placeholder={`Search ${tab.label.toLowerCase()}...`}
                className="pl-9 pr-4 rounded-xl focus-visible:ring-indigo-500 h-11 w-full bg-background transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredData.length > 0 ? (
            <div className="divide-y divide-muted/30">
              {filteredData.map((item) => (
                <div 
                  key={item._id} 
                  className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/40 dark:hover:bg-slate-900/20 group transition-all duration-150"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-tight truncate">
                      {item.name}
                    </span>
                    <Badge 
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        item.isActive ?? true
                          ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-none' 
                          : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-none'
                      }`}
                    >
                      {item.isActive ?? true ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(item)}
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(item._id)}
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Premium Crafted Empty State Component */
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-sm mx-auto">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-muted/40 text-muted-foreground/60 mb-4 shadow-2xs">
                <HelpCircle className="h-8 w-8 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-foreground tracking-tight">No Records Located</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                We couldn't locate matching records for "{searchTerm || tab.label}". Try introducing a fresh record configuration variant above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Polish Premium Confirmation Dialog Form Box */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <div className={`h-1.5 w-full bg-gradient-to-r ${tab.gradient}`} />
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Update Row Entry
            </DialogTitle>
            <DialogDescription className="text-xs mt-1">
              Refine parameters for global selection tags inside the infrastructure.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Item Identity Title Name
              </Label>
              <Input
                value={editItem?.name || ''}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                className="rounded-xl focus-visible:ring-indigo-500 h-11 pl-4"
                placeholder="Modify name parameter..."
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
              />
            </div>
          </DialogBody>
          <DialogFooter className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setEditItem(null)}
              className="w-full rounded-xl h-11 font-medium transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending || !editItem?.name?.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl h-11 shadow-sm transition-all"
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
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto bg-background text-foreground antialiased">
      {/* Modern SaaS Header Container Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-muted/40 bg-gradient-to-r from-slate-50 to-white p-6 dark:from-slate-950 dark:to-background shadow-2xs">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <PageHeader
          title="Master Data Management"
          description="Govern systematic parameters, structural attributes, global taxonomy indexes, and dropdown data feeds for HireHub."
        />
      </div>

      {/* Advanced Navigational Tabs Panel Systems */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-2xl h-auto gap-1 border border-muted/20">
          {TABS.map((tab) => {
            const CurrentIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className={`rounded-xl py-3 text-xs font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-2 h-10 data-[state=active]:shadow-sm border border-transparent data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 ${
                  isActive ? 'border-muted/30' : 'text-muted-foreground/80 hover:text-foreground'
                }`}
              >
                <CurrentIcon className={`h-3.5 w-3.5 transition-transform ${isActive ? 'scale-110 text-indigo-500' : ''}`} />
                <span>{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="outline-hidden mt-2 focus-visible:ring-0">
            <MasterDataTable tab={tab} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}