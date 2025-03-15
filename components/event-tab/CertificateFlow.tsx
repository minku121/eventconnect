import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CertificateData {
  eventId: string;
  isPaid: boolean;
  price: number | null;
  participants: number[];
}

export function CertificateFlow({ event, onComplete }:any) {
  const [open, setOpen] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('');

  const handleDistribute = async () => {
    try {
      const response = await fetch('/api/certificates/distribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.eventId,
          isPaid,
          price: isPaid ? parseFloat(price) : null,
          participants: event.participants
        }),
      });

      if (response.ok) {
        onComplete();
        setOpen(false);
      }
    } catch (error) {
      console.error('Certificate distribution failed:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Distribute Certificates?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input 
              type="radio" 
              id="free" 
              checked={!isPaid} 
              onChange={() => setIsPaid(false)}
            />
            <label htmlFor="free">Free Distribution</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="paid"
              checked={isPaid}
              onChange={() => setIsPaid(true)}
            />
            <label htmlFor="paid">Paid Distribution</label>
          </div>
          {isPaid && (
            <div className="space-y-2">
              <label htmlFor="price">Certificate Price</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
                required={isPaid}
              />
            </div>
          )}
          <Button onClick={handleDistribute}>
            Confirm Distribution
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 