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
        <div className="space-y-1.5 group">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-[#A05AFF] shrink-0" />
            <span>Target Subjects</span>
          </Label>
          <div className="relative">
            <MultiSelect
              options={subjectOptions}
              value={subjects}
              onChange={onSubjectsChange}
              placeholder="Select subjects you can specialize in..."
              className="rounded-xl min-h-11 border-slate-200 bg-white dark:bg-slate-900 shadow-sm focus-within:ring-[#A05AFF] focus-within:border-[#A05AFF]/50"
            />
          </div>
        </div>
      )}

      {/* Classes Conditional Section */}
      {showsClasses(position) && (
        <div className="space-y-1.5 group">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-[#A05AFF] shrink-0" />
            <span>Classes Can Teach</span>
          </Label>
          <div className="relative">
            <MultiSelect
              options={classOptions}
              value={classesCanTeach}
              onChange={onClassesChange}
              placeholder="Select target class levels..."
              className="rounded-xl min-h-11 border-slate-200 bg-white dark:bg-slate-900 shadow-sm focus-within:ring-[#A05AFF] focus-within:border-[#A05AFF]/50"
            />
          </div>
        </div>
      )}

      {/* Vehicle Types Conditional Section */}
      {showsVehicleTypes(position) && (
        <div className="space-y-1.5 md:col-span-2 group">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-focus-within:text-[#A05AFF] transition-colors flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-[#A05AFF] shrink-0" />
            <span>Eligible Vehicle Types</span>
          </Label>
          <div className="relative">
            <MultiSelect
              options={VEHICLE_TYPES}
              value={vehicleTypes}
              onChange={onVehicleTypesChange}
              placeholder="Select commercial or operational vehicle types..."
              className="rounded-xl min-h-11 border-slate-200 bg-white dark:bg-slate-900 shadow-sm focus-within:ring-[#A05AFF] focus-within:border-[#A05AFF]/50"
            />
          </div>
        </div>
      )}
    </>
  );
}