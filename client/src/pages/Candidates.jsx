import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCandidates, deleteCandidate, getSettings, getStates } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';

const SOURCE_OPTIONS = ['ADMIN', 'SCHOOL_LINK', 'SELF_APPLICANT', 'SUPER_ADMIN_IMPORT'];

export function CandidateList({
  section,
  title,
  description,
  showAddButton = false,
  sourceFilterOptions = SOURCE_OPTIONS,
}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    name: '',
    mobile: '',
    position: '',
    qualification: '',
    experience: '',
    state: '',
    city: '',
    locality: '',
    source: '',
    expectedSalaryMin: '',
    expectedSalaryMax: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [deleteId, setDeleteId] = useState(null);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: () => getStates().then((r) => r.data.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', section, page, filters],
    queryFn: () =>
      getCandidates({
        section,
        page,
        limit: 10,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')),
      }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteId(null);
    },
  });

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        action={
          showAddButton ? (
            <Button asChild>
              <Link to="/candidates/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Candidate
              </Link>
            </Button>
          ) : null
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name"
                className="pl-9"
                value={filters.name}
                onChange={(e) => updateFilter('name', e.target.value)}
              />
            </div>
            <Input
              placeholder="Search by mobile"
              value={filters.mobile}
              onChange={(e) => updateFilter('mobile', e.target.value)}
            />
            <Select value={filters.position || 'all'} onValueChange={(v) => updateFilter('position', v === 'all' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {settings?.positions?.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.qualification || 'all'}
              onValueChange={(v) => updateFilter('qualification', v === 'all' ? '' : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Qualification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Qualifications</SelectItem>
                {settings?.qualifications?.map((q) => (
                  <SelectItem key={q} value={q}>
                    {q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Experience (years)"
              value={filters.experience}
              onChange={(e) => updateFilter('experience', e.target.value)}
            />
            <Select value={filters.state || 'all'} onValueChange={(v) => updateFilter('state', v === 'all' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((s) => <SelectItem key={s._id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="City" value={filters.city} onChange={(e) => updateFilter('city', e.target.value)} />
            <Input placeholder="Locality" value={filters.locality} onChange={(e) => updateFilter('locality', e.target.value)} />
            {section !== 'talent_pool' && (
              <Select value={filters.source || 'all'} onValueChange={(v) => updateFilter('source', v === 'all' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sourceFilterOptions.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            <Input
              type="number"
              placeholder="Min Salary"
              value={filters.expectedSalaryMin}
              onChange={(e) => updateFilter('expectedSalaryMin', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Salary"
              value={filters.expectedSalaryMax}
              onChange={(e) => updateFilter('expectedSalaryMax', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('fullName')}>
                      Name
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('position')}>
                      Position
                    </TableHead>
                    <TableHead>Location</TableHead>
                    {section === 'talent_pool' && <TableHead>Pool</TableHead>}
                    <TableHead>Qualification</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('experienceYears')}>
                      Experience
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('expectedSalary')}>
                      Expected Salary
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                      Date Added
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        No candidates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.map((c) => (
                      <TableRow key={c._id}>
                        <TableCell className="font-medium">
                          {c.fullName}
                          {c.isLocked && <Badge variant="outline" className="ml-2 text-xs">Locked</Badge>}
                        </TableCell>
                        <TableCell>{c.position}</TableCell>
                        <TableCell className="text-xs">{[c.city, c.locality].filter(Boolean).join(', ') || '-'}</TableCell>
                        {section === 'talent_pool' && (
                          <TableCell>
                            {c.source ? (
                              <Badge variant="secondary">{c.source.replace(/_/g, ' ')}</Badge>
                            ) : (
                              <Badge variant="outline">Talent Pool</Badge>
                            )}
                          </TableCell>
                        )}
                        <TableCell>{c.qualifications?.join(', ') || '-'}</TableCell>
                        <TableCell>{c.experienceYears} yrs</TableCell>
                        <TableCell>{c.expectedSalary ? `₹${c.expectedSalary.toLocaleString()}` : c.isLocked ? '—' : '-'}</TableCell>
                        <TableCell>{formatDate(c.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/candidates/${c._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {c.canEdit && (
                              <>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link to={`/candidates/${c._id}/edit`}>
                                    <Pencil className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(c._id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {data?.pagination && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.pagination.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Candidate</DialogTitle>
            <DialogDescription>
              This will soft-delete the candidate from your school database.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MyCandidates() {
  return (
    <CandidateList
      section="my_candidates"
      title="My Candidates"
      description="Candidates added by your school (ADMIN) and via your application link (SCHOOL_LINK). Full access, no credit required."
      showAddButton
    />
  );
}

export function TalentPool() {
  return (
    <CandidateList
      section="talent_pool"
      title="Talent Pool"
      description="Browse platform candidates and profiles from other schools. Unlock profiles using credits."
      sourceFilterOptions={['SELF_APPLICANT']}
    />
  );
}
