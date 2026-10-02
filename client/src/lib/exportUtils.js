/**
 * Export and Print Utilities for Super Admin
 */

function escapeCSV(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Exports an array of candidates to an Excel-compatible CSV file with UTF-8 BOM.
 */
export function exportCandidatesToCSV(candidates = [], filename = 'candidates_report.csv') {
  if (!candidates || candidates.length === 0) {
    alert('No candidates available to export.');
    return;
  }

  const headers = [
    'School Name',
    'Candidate Name',
    'Mobile',
    'Email',
    'Position / Role',
    'Experience (Years)',
    'Expected Salary (INR)',
    'Status',
    'City',
    'State',
    'Address',
    'Subjects',
    'Qualifications',
    'Source',
    'Applied / Registered Date',
  ];

  const rows = candidates.map((c) => [
    escapeCSV(c.schoolName || c.school?.schoolName || 'Platform Pool'),
    escapeCSV(c.fullName || c.name || '-'),
    escapeCSV(c.mobile || '-'),
    escapeCSV(c.email || '-'),
    escapeCSV(c.position || '-'),
    escapeCSV(c.experienceYears ?? 0),
    escapeCSV(c.expectedSalary ? `Rs. ${c.expectedSalary}` : '-'),
    escapeCSV((c.status || 'new').toUpperCase()),
    escapeCSV(c.city || '-'),
    escapeCSV(c.state || '-'),
    escapeCSV(c.address || c.area || '-'),
    escapeCSV(Array.isArray(c.subjects) ? c.subjects.join('; ') : (c.subjects || '-')),
    escapeCSV(Array.isArray(c.qualifications) ? c.qualifications.join('; ') : (c.qualifications || '-')),
    escapeCSV(c.source || 'PORTAL'),
    escapeCSV(c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '-'),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens a print dialog with a clean, professional, high-resolution PDF layout.
 */
export function printCandidatesReport(candidates = [], title = 'Candidates Roster Report', schoolInfo = null) {
  if (!candidates || candidates.length === 0) {
    alert('No candidates available to print or export as PDF.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Popup blocker prevented print view. Please allow popups for this site.');
    return;
  }

  const generatedDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const rowsHtml = candidates
    .map(
      (c, index) => `
    <tr>
      <td style="text-align: center; font-weight: bold; color: #64748b;">${index + 1}</td>
      <td>
        <strong style="color: #0f172a;">${escapeHTML(c.fullName || c.name || '-')}</strong>
        ${c.email ? `<br><small style="color: #64748b;">${escapeHTML(c.email)}</small>` : ''}
      </td>
      <td><strong>${escapeHTML(c.position || '-')}</strong></td>
      <td style="font-family: monospace;">${escapeHTML(c.mobile || '-')}</td>
      <td>${c.experienceYears ?? 0} yrs</td>
      <td>
        <span class="badge badge-${(c.status || 'new').toLowerCase()}">
          ${(c.status || 'new').toUpperCase()}
        </span>
      </td>
      <td>${escapeHTML([c.city, c.state].filter(Boolean).join(', ') || '-')}</td>
      <td>${c.schoolName || c.school?.schoolName || schoolInfo?.schoolName || 'Platform Pool'}</td>
      <td style="white-space: nowrap;">${c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '-'}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${escapeHTML(title)}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm 15mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 20px;
            background: #fff;
            font-size: 11px;
            line-height: 1.4;
          }
          .header-box {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .title-area h1 {
            font-size: 18px;
            margin: 0 0 4px 0;
            color: #1e1b4b;
          }
          .title-area p {
            margin: 0;
            color: #64748b;
            font-size: 11px;
          }
          .meta-area {
            text-align: right;
            font-size: 11px;
            color: #475569;
          }
          .meta-badge {
            display: inline-block;
            background: #f1f5f9;
            color: #334155;
            padding: 4px 10px;
            border-radius: 6px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th {
            background-color: #f8fafc;
            color: #334155;
            font-weight: 700;
            text-align: left;
            padding: 8px 10px;
            border-top: 1px solid #cbd5e1;
            border-bottom: 2px solid #cbd5e1;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 7px 10px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          tr {
            page-break-inside: avoid;
          }
          .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.4px;
          }
          .badge-hired { background: #dcfce7; color: #166534; }
          .badge-shortlisted { background: #e0e7ff; color: #3730a3; }
          .badge-interview_scheduled { background: #fef3c7; color: #92400e; }
          .badge-new { background: #f1f5f9; color: #475569; }
          .badge-rejected { background: #fee2e2; color: #991b1b; }
          .footer-note {
            margin-top: 20px;
            font-size: 10px;
            color: #94a3b8;
            text-align: center;
            border-top: 1px dashed #cbd5e1;
            padding-top: 8px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div class="title-area">
            <h1>${escapeHTML(title)}</h1>
            <p>
              ${
                schoolInfo
                  ? `<strong>School:</strong> ${escapeHTML(schoolInfo.schoolName)} (${escapeHTML(schoolInfo.email || '')})`
                  : 'Platform Wide Super Admin Candidate Master Roll'
              }
            </p>
          </div>
          <div class="meta-area">
            <div class="meta-badge">Total Records: ${candidates.length}</div>
            <div>Generated: ${generatedDate}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px; text-align: center;">#</th>
              <th>Candidate Name</th>
              <th>Position</th>
              <th>Mobile</th>
              <th>Exp</th>
              <th>Status</th>
              <th>Location</th>
              <th>School / Pool</th>
              <th>Applied Date</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer-note">
          Confidential - Generated via Platform Super Admin Console. Total ${candidates.length} record(s) included.
        </div>

        <script>
          window.onload = function() {
            window.focus();
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
