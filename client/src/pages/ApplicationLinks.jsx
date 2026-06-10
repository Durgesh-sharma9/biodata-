import { useQuery } from '@tanstack/react-query';
import { Copy, ExternalLink } from 'lucide-react';
import { getApplicationLink, getApplicationQR } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ApplicationLinks() {
  const { data: linkData } = useQuery({
    queryKey: ['application-link'],
    queryFn: () => getApplicationLink().then((r) => r.data.data),
  });

  const { data: qrData } = useQuery({
    queryKey: ['application-qr'],
    queryFn: () => getApplicationQR().then((r) => r.data.data),
  });

  const copyLink = () => {
    if (linkData?.applyUrl) {
      navigator.clipboard.writeText(linkData.applyUrl);
      alert('Link copied!');
    }
  };

  return (
    <div>
      <PageHeader title="Application Links" description="Share your public application link with candidates" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Public Application Link</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input readOnly value={linkData?.applyUrl || ''} />
              <Button variant="outline" onClick={copyLink}>
                <Copy className="h-4 w-4" />
              </Button>
              {linkData?.applyUrl && (
                <Button variant="outline" asChild>
                  <a href={linkData.applyUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Candidates who apply via this link will be added with source SCHOOL_LINK and owned by your school.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>QR Code</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            {qrData?.qrDataUrl ? (
              <img src={qrData.qrDataUrl} alt="Application QR Code" className="h-64 w-64" />
            ) : (
              <p className="text-muted-foreground">Loading QR code...</p>
            )}
            <p className="mt-4 text-center text-sm text-muted-foreground">{qrData?.applyUrl}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
