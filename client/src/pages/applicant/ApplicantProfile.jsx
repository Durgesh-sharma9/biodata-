import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getApplicantProfile,
  updateApplicantProfile,
  getSettings,
  getPositions,
} from '@/lib/api';
import { DynamicCandidateForm } from '@/components/forms/DynamicCandidateForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Pencil,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Sparkles,
  Printer,
  Compass,
  XCircle,
  X,
  FileCheck,
  Award,
  Clock,
  BookOpen,
} from 'lucide-react';

function Toast({ type, message, onClose }) {
  const isSuccess = type === 'success';
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-2xl shadow-xl border max-w-sm w-full animate-in slide-in-from-bottom-4 fade-in duration-300
        ${isSuccess
          ? 'bg-white border-emerald-300 text-slate-800 dark:bg-slate-900 dark:border-emerald-700 dark:text-white'
          : 'bg-white border-red-300 text-slate-800 dark:bg-slate-900 dark:border-red-700 dark:text-white'
        }`}
      style={{ animation: 'slideUpFade 0.35s ease-out' }}
    >
      <div className={`p-2 rounded-xl flex-shrink-0 ${isSuccess ? 'bg-emerald-100 dark:bg-emerald-950/60' : 'bg-red-100 dark:bg-red-950/60'}`}>
        {isSuccess
          ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          : <XCircle className="h-5 w-5 text-red-600" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${isSuccess ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
          {isSuccess ? 'Profile Updated' : 'Update Failed'}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
          {message}
        </p>
        {isSuccess && (
          <div className="mt-2 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ animation: 'shrinkBar 4s linear forwards' }}
            />
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors mt-0.5"
      >
        <X className="h-4 w-4" />
      </button>

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shrinkBar {
          from { width: 100%; }
          to   { width: 0%;   }
        }
      `}</style>
    </div>
  );
}

function DetailRow({ label, value, icon: Icon }) {
  if (value == null || value === '') return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-4 border-b border-slate-100 dark:border-slate-800/80 py-3 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 px-2 rounded-lg transition-colors">
      <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2 self-center">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />}
        <span>{label}</span>
      </dt>
      <dd className="sm:col-span-2 text-sm font-semibold text-slate-800 dark:text-slate-100 self-center break-words">
        {value}
      </dd>
    </div>
  );
}

function ProfileView({ candidate, onEdit, positionsData }) {
  const pos = candidate.position;
  const posDef = (positionsData || []).find(
    (p) => (typeof p === 'object' ? p.name : p) === pos
  );

  const roleRows = [];
  if (posDef && posDef.fields?.length > 0) {
    posDef.fields.forEach((field) => {
      const val = candidate[field.name];
      if (val != null && val !== '') {
        let displayVal = val;
        if (field.type === 'checkbox') {
          displayVal = val ? 'Yes' : 'No';
        } else if (Array.isArray(val)) {
          displayVal = val.length ? val.join(', ') : '-';
        } else if (field.name.toLowerCase().includes('experience') && typeof val === 'number') {
          displayVal = `${val} Years`;
        }
        roleRows.push({ label: field.label, value: String(displayVal) });
      }
    });
  } else {
    if (pos === 'Teacher') {
      if (candidate.subjects?.length) roleRows.push({ label: 'Subjects', value: candidate.subjects.join(', ') });
      if (candidate.classesCanTeach?.length) roleRows.push({ label: 'Classes Can Teach', value: candidate.classesCanTeach.join(', ') });
      if (candidate.medium) roleRows.push({ label: 'Medium', value: candidate.medium });
      if (candidate.boardExperience?.length) roleRows.push({ label: 'Board Experience', value: candidate.boardExperience.join(', ') });
      if (candidate.bEd != null) roleRows.push({ label: 'B.Ed Qualification', value: candidate.bEd ? 'Yes' : 'No' });
      if (candidate.mEd != null) roleRows.push({ label: 'M.Ed Qualification', value: candidate.mEd ? 'Yes' : 'No' });
    } else if (pos === 'Driver') {
      if (candidate.vehicleTypes?.length) roleRows.push({ label: 'Vehicle Types', value: candidate.vehicleTypes.join(', ') });
      if (candidate.drivingExperience != null) roleRows.push({ label: 'Driving Experience', value: `${candidate.drivingExperience} Years` });
      if (candidate.lightVehicle != null) roleRows.push({ label: 'Light Vehicle License', value: candidate.lightVehicle ? 'Yes' : 'No' });
      if (candidate.heavyVehicle != null) roleRows.push({ label: 'Heavy Vehicle License', value: candidate.heavyVehicle ? 'Yes' : 'No' });
      if (candidate.schoolBusExperience != null) roleRows.push({ label: 'School Bus Experience', value: candidate.schoolBusExperience ? 'Yes' : 'No' });
    } else if (pos === 'Accountant') {
      if (candidate.tallyKnowledge != null) roleRows.push({ label: 'Tally Knowledge', value: candidate.tallyKnowledge ? 'Yes' : 'No' });
      if (candidate.gstKnowledge != null) roleRows.push({ label: 'GST Knowledge', value: candidate.gstKnowledge ? 'Yes' : 'No' });
      if (candidate.payrollExperience != null) roleRows.push({ label: 'Payroll Experience', value: candidate.payrollExperience ? 'Yes' : 'No' });
      if (candidate.schoolAccountingExperience != null) roleRows.push({ label: 'School Accounting', value: candidate.schoolAccountingExperience ? 'Yes' : 'No' });
      if (candidate.erpExperience != null) roleRows.push({ label: 'ERP Experience', value: candidate.erpExperience ? 'Yes' : 'No' });
    } else if (pos === 'Receptionist') {
      if (candidate.languagesKnown?.length) roleRows.push({ label: 'Languages Known', value: candidate.languagesKnown.join(', ') });
      if (candidate.computerSkills != null) roleRows.push({ label: 'Computer Skills', value: candidate.computerSkills ? 'Yes' : 'No' });
      if (candidate.frontDeskExperience != null) roleRows.push({ label: 'Front Desk Experience', value: candidate.frontDeskExperience ? 'Yes' : 'No' });
      if (candidate.communicationSkills != null) roleRows.push({ label: 'Communication Skills', value: candidate.communicationSkills ? 'Yes' : 'No' });
    } else if (pos === 'Clerk') {
      if (candidate.typingSpeed) roleRows.push({ label: 'Typing Speed', value: candidate.typingSpeed });
      if (candidate.msOfficeKnowledge != null) roleRows.push({ label: 'MS Office Knowledge', value: candidate.msOfficeKnowledge ? 'Yes' : 'No' });
      if (candidate.excelKnowledge != null) roleRows.push({ label: 'Excel Knowledge', value: candidate.excelKnowledge ? 'Yes' : 'No' });
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Profile Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Component */}
            <div className="relative shrink-0">
              {candidate.profilePhoto ? (
                <img
                  src={candidate.profilePhoto}
                  alt={candidate.fullName}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shadow-sm border border-slate-100 dark:border-slate-800"
                />
              ) : (
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-700 text-white flex items-center justify-center text-3xl font-black shadow-sm">
                  {candidate.fullName?.charAt(0)?.toUpperCase() || 'C'}
                </div>
              )}
              <span
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 ring-2 ring-white dark:ring-slate-900 shadow-xs"
                title="Profile Active in Talent Pool"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </span>
            </div>

            {/* Candidate Identity */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {candidate.fullName}
                </h1>
                <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold px-3 py-1 rounded-xl text-xs uppercase tracking-wide">
                  {candidate.position || 'Applicant'}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-emerald-700 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-xs font-semibold px-2.5 py-0.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse" />
                  Talent Pool Active
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                {candidate.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    {candidate.city}{candidate.state ? `, ${candidate.state}` : ''}
                  </span>
                )}
                {candidate.experienceYears != null && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    {candidate.experienceYears} Years Experience
                  </span>
                )}
                {candidate.expectedSalary != null && candidate.expectedSalary > 0 && (
                  <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                    <IndianRupee className="h-3.5 w-3.5" />
                    ₹{Number(candidate.expectedSalary).toLocaleString('en-IN')}/mo Expected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons in Hero */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto pt-2 lg:pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.print()}
              className="h-10 px-4 rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Print CV</span>
            </Button>

            <Button
              type="button"
              onClick={onEdit}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards (Matte & Clear) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Primary Role</p>
            <p className="text-base font-black text-slate-900 dark:text-slate-100 truncate mt-0.5">
              {candidate.position || 'Teacher'}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Experience</p>
            <p className="text-base font-black text-slate-900 dark:text-slate-100 truncate mt-0.5">
              {candidate.experienceYears != null ? `${candidate.experienceYears} Years` : 'Fresher'}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <IndianRupee className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Expected Salary</p>
            <p className="text-base font-black text-emerald-700 dark:text-emerald-400 truncate mt-0.5">
              {candidate.expectedSalary ? `₹${Number(candidate.expectedSalary).toLocaleString('en-IN')}` : 'Negotiable'}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center shrink-0">
            <Compass className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Working Radius</p>
            <p className="text-base font-black text-slate-900 dark:text-slate-100 truncate mt-0.5">
              {candidate.workingRadius ? `${candidate.workingRadius} km Radius` : 'Flexible'}
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Personal & Contact + Privacy */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 rounded-xl">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Personal & Contact Details
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Your contact information visible to verified schools
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              <dl>
                <DetailRow label="Full Name" value={candidate.fullName} icon={User} />
                <DetailRow label="Mobile Number" value={candidate.mobile} icon={Phone} />
                <DetailRow label="Email Address" value={candidate.email} icon={Mail} />
                <DetailRow label="Gender" value={candidate.gender} icon={User} />
                <DetailRow
                  label="Date of Birth"
                  value={candidate.dob ? new Date(candidate.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null}
                  icon={Calendar}
                />
                <DetailRow label="Full Address" value={candidate.address} icon={MapPin} />
                <DetailRow label="State & City" value={[candidate.city, candidate.state].filter(Boolean).join(', ')} icon={MapPin} />
                <DetailRow label="Area / Locality" value={candidate.area} icon={Compass} />
                <DetailRow label="Working Radius" value={candidate.workingRadius ? `${candidate.workingRadius} km from residence` : null} icon={Compass} />
              </dl>
            </CardContent>
          </Card>

          {/* Privacy & Consents */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-xl">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Recruitment Privacy & Visibility
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Active consent settings for school recruitment outreach
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Talent Pool Discovery</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Profile appears in candidate search for school principals</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-0 text-[11px] font-bold shrink-0 ml-2">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">School Contact Consent</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Verified schools can send direct employment interest requests</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-0 text-[11px] font-bold shrink-0 ml-2">
                  Granted
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Qualifications, Specialization & Documents */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-xl">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Qualifications & Specialization
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Academic degrees, subjects, and teaching credentials
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4">
              <div>
                <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Academic Degrees / Qualifications
                </dt>
                {candidate.qualifications && candidate.qualifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {candidate.qualifications.map((q) => (
                      <Badge
                        key={q}
                        variant="outline"
                        className="bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 font-bold text-xs px-3 py-1 rounded-xl shadow-xs"
                      >
                        {q}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No qualifications added yet</p>
                )}
              </div>

              {candidate.subjects && candidate.subjects.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    Subjects Taught / Expertise
                  </dt>
                  <div className="flex flex-wrap gap-2">
                    {candidate.subjects.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-xs px-3 py-1 rounded-xl"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {candidate.classesCanTeach && candidate.classesCanTeach.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    Classes Eligible to Teach
                  </dt>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.classesCanTeach.map((c) => (
                      <Badge
                        key={c}
                        variant="outline"
                        className="border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 font-semibold text-xs px-2.5 py-0.5 rounded-lg"
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Role-Specific Custom Parameters */}
              {roleRows.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    Role-Specific Parameters
                  </dt>
                  <dl className="space-y-1">
                    {roleRows.map(({ label, value }) => (
                      <DetailRow key={label} label={label} value={value} />
                    ))}
                  </dl>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 rounded-xl">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Uploaded Documents & Resume
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Certificates and CV available to prospective employers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              {candidate.documents && candidate.documents.length > 0 ? (
                <div className="space-y-2.5">
                  {candidate.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-800/50 dark:border-slate-800 hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shrink-0">
                          <FileCheck className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {doc.name || `Document ${idx + 1}`}
                          </p>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {doc.type || 'Attachment'}
                          </span>
                        </div>
                      </div>

                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-600 text-xs font-bold transition-colors"
                        >
                          <span>View</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4">
                  <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    No documents attached yet
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={onEdit}
                    className="text-xs font-bold text-blue-600 mt-1 h-auto p-0"
                  >
                    Click here to upload your Resume in Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ApplicantProfile() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['applicant-profile'],
    queryFn: () => getApplicantProfile().then((r) => r.data.data),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings().then((r) => r.data.data),
  });

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions().then((r) => r.data.data),
  });

  const [toast, setToast] = useState(null);

  const hasExistingProfile = Boolean(profile?._id && profile?.fullName && profile?.position);

  const [isEditing, setIsEditing] = useState(() => {
    return searchParams.get('edit') === 'true';
  });

  useEffect(() => {
    if (!isLoading && profile) {
      if (!profile._id || !profile.position) {
        setIsEditing(true);
      }
    }
  }, [isLoading, profile]);

  const showToast = (type, message) => {
    setToast({ type, message });
    if (type === 'success') {
      setTimeout(() => setToast(null), 4500);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setSearchParams({ edit: 'true' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSearchParams({});
  };

  const updateMutation = useMutation({
    mutationFn: updateApplicantProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicant-profile'] });
      setIsEditing(false);
      setSearchParams({});
      showToast(
        'success',
        'Your candidate profile has been saved. Schools in the talent pool can now see your updated information.'
      );
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      showToast('error', msg);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-2 antialiased">
        <div className="h-7 w-7 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full antialiased text-slate-800 dark:text-white max-w-6xl mx-auto pb-10">
      
      {/* Edit Mode Top Header / Banner */}
      {isEditing && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              <Pencil className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Candidate Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update your personal information, teaching experience, and qualifications
              </p>
            </div>
          </div>

          {hasExistingProfile && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelEdit}
              className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel & View Profile</span>
            </Button>
          )}
        </div>
      )}

      {/* Main Content */}
      {isEditing ? (
        <DynamicCandidateForm
          initialValues={profile}
          onSubmit={(data) => updateMutation.mutate(data)}
          settings={settings}
          positions={positions}
          isLoading={updateMutation.isPending}
          submitButtonText="Update Profile"
          disabledFields={[]}
          onCancel={hasExistingProfile ? handleCancelEdit : undefined}
        />
      ) : (
        <ProfileView
          candidate={profile}
          onEdit={handleStartEdit}
          positionsData={positions}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
