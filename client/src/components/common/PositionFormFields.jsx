import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { BookOpen, GraduationCap, Truck, Sparkles } from 'lucide-react';
import {
  showsSubjects,
  showsClasses,
  showsVehicleTypes,
  VEHICLE_TYPES,
} from '@/config/positionForms';

export function PositionFormFields({
  position,
  subjects = [],
  classesCanTeach = [],
  vehicleTypes = [],
  onSubjectsChange,
  onClassesChange,
  onVehicleTypesChange,
  subjectOptions = [],
  classOptions = [],
}) {
  if (!position) return null;

  return (
    <>
      {/* Subjects Conditional Section */}
      {showsSubjects(position) && (
        <div className="space-y-2 group animate-in fade-in slide-in-from-top-2 duration-200">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span>Target Subjects</span>
          </Label>
          <div className="relative rounded-xl transition-all">
            <MultiSelect
              options={subjectOptions}
              value={subjects}
              onChange={onSubjectsChange}
              placeholder="Select subjects you can specialize in..."
              className="rounded-xl min-h-11 border-slate-200 bg-background transition-all shadow-2xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Classes Conditional Section */}
      {showsClasses(position) && (
        <div className="space-y-2 group animate-in fade-in slide-in-from-top-2 duration-200 [animation-delay:50ms]">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span>Classes Can Teach</span>
          </Label>
          <div className="relative rounded-xl transition-all">
            <MultiSelect
              options={classOptions}
              value={classesCanTeach}
              onChange={onClassesChange}
              placeholder="Select target class levels..."
              className="rounded-xl min-h-11 border-slate-200 bg-background transition-all shadow-2xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Vehicle Types Conditional Section */}
      {showsVehicleTypes(position) && (
        <div className="space-y-2 md:col-span-2 group animate-in fade-in slide-in-from-top-2 duration-200 [animation-delay:100ms]">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/90 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span>Eligible Vehicle Types</span>
          </Label>
          <div className="relative rounded-xl transition-all">
            <MultiSelect
              options={VEHICLE_TYPES}
              value={vehicleTypes}
              onChange={onVehicleTypesChange}
              placeholder="Select commercial or operational vehicle types..."
              className="rounded-xl min-h-11 border-slate-200 bg-background transition-all shadow-2xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500"
            />
          </div>
        </div>
      )}
    </>
  );
}