import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
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
      {showsSubjects(position) && (
        <div className="space-y-2">
          <Label>Subjects</Label>
          <MultiSelect
            options={subjectOptions}
            value={subjects}
            onChange={onSubjectsChange}
            placeholder="Select subjects"
          />
        </div>
      )}

      {showsClasses(position) && (
        <div className="space-y-2">
          <Label>Classes Can Teach</Label>
          <MultiSelect
            options={classOptions}
            value={classesCanTeach}
            onChange={onClassesChange}
            placeholder="Select classes"
          />
        </div>
      )}

      {showsVehicleTypes(position) && (
        <div className="space-y-2 md:col-span-2">
          <Label>Vehicle Types</Label>
          <MultiSelect
            options={VEHICLE_TYPES}
            value={vehicleTypes}
            onChange={onVehicleTypesChange}
            placeholder="Select vehicle types"
          />
        </div>
      )}
    </>
  );
}
