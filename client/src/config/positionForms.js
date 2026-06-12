export const APPLICATION_POSITIONS = [
  'Teacher',
  'Driver',
  'Accountant',
  'Receptionist',
  'Clerk',
  'Librarian',
  'Lab Assistant',
  'Sports Coach',
  'Security Guard',
  'Cleaner',
];

export const VEHICLE_TYPES = ['School Bus', 'Car', 'Van', 'Heavy Vehicle'];

export const SUBJECT_POSITIONS = ['Teacher', 'Sports Coach', 'Librarian', 'Lab Assistant'];
export const CLASS_POSITIONS = ['Teacher', 'Sports Coach'];
export const DRIVER_POSITIONS = ['Driver'];

export const showsSubjects = (position) => SUBJECT_POSITIONS.includes(position);
export const showsClasses = (position) => CLASS_POSITIONS.includes(position);
export const showsVehicleTypes = (position) => DRIVER_POSITIONS.includes(position);
