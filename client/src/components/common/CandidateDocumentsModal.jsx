import { useState } from 'react';
import { 
  FileText, ExternalLink, Download, FileCheck, Image as ImageIcon, 
  File, X, Eye
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function CandidateDocumentsModal({ isOpen, onClose, candidate }) {
  if (!candidate) return null;

  const documents = Array.isArray(candidate.documents) ? candidate.documents : [];
  const candidateName = candidate.fullName || 'Candidate';

  const isImageFile = (url = '', name = '') => {
    const testStr = `${url} ${name}`.toLowerCase();
    return /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(testStr);
  };

  const isPdfFile = (url = '', name = '') => {
    const testStr = `${url} ${name}`.toLowerCase();
    return /\.pdf($|\?)/i.test(testStr);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 rounded-2xl overflow-hidden dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300 flex items-center justify-center border border-purple-200/70 shadow-2xs shrink-0">
              <FileCheck className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                Attached Documents & Resumes
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {candidateName} • {documents.length} document{documents.length === 1 ? '' : 's'} available
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Documents Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {documents.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="h-6 w-6 stroke-[1.8]" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No documents attached</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No resumes, certificates or portfolio documents have been uploaded for {candidateName} yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc, idx) => {
                const docUrl = typeof doc === 'string' ? doc : doc.url;
                const docName = typeof doc === 'string' ? doc.split('/').pop() : (doc.name || `Document #${idx + 1}`);
                const docNote = typeof doc === 'string' ? null : doc.note;
                const isImg = isImageFile(docUrl, docName);
                const isPdf = isPdfFile(docUrl, docName);

                return (
                  <div
                    key={idx}
                    className="group flex flex-col justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 bg-white dark:bg-slate-850 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Thumbnail / Icon */}
                      <div className="shrink-0">
                        {isImg && docUrl ? (
                          <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <img src={docUrl} alt={docName} className="h-full w-full object-cover" />
                          </div>
                        ) : isPdf ? (
                          <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center border border-rose-200/60 font-bold text-[10px]">
                            PDF
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-teal-50 text-[#0F766E] dark:bg-teal-950/40 dark:text-[#2DD4BF] flex items-center justify-center border border-teal-200/60">
                            <File className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" title={docName}>
                          {docName}
                        </p>
                        {docNote && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 mt-0.5">
                            {docNote}
                          </p>
                        )}
                        <span className="inline-block mt-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {isPdf ? 'PDF Document' : isImg ? 'Image / Photo' : 'Attached File'}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                      {docUrl && (
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-7 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 text-xs font-bold flex items-center gap-1 border border-purple-200/70 shadow-2xs transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Open File</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-8.5 px-4 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default CandidateDocumentsModal;
