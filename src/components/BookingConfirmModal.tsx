import { X, Calendar, Clock, Moon, Users, Monitor, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

import lectureHallImg from '@/assets/lecture-hall.jpg';

interface BookingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const BookingConfirmModal = ({ isOpen, onClose, onConfirm }: BookingConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg overflow-hidden p-0">
        <div className="relative h-40 overflow-hidden">
          <img 
            src={lectureHallImg} 
            alt="Lecture Hall"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-4">
            <span className="mb-1 inline-block rounded bg-foreground/80 px-2 py-0.5 text-xs font-medium text-background">
              Laboratory
            </span>
            <h3 className="text-xl font-semibold text-white">Lecture Hall A - Engineering Building</h3>
            <p className="flex items-center gap-1 text-sm text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              Science Block B, 3rd Floor
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">Confirm Your Booking</h4>
          </div>
          
          <p className="mb-6 text-sm text-muted-foreground">
            Please review the details below carefully. Ensure the time and date are correct before finalizing your reservation.
          </p>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-foreground">Wednesday, Oct 24, 2023</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-medium text-foreground">14:00 - 16:00</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Moon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium text-foreground">2 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Purpose</p>
                <p className="text-sm font-medium text-foreground">Chemistry 101 Lab</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Capacity</p>
                <p className="text-sm font-medium text-foreground">45 Students</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Monitor className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Equipment</p>
                <p className="text-sm font-medium text-foreground">Projector, Safety Goggles</p>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-warning/10 p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 shrink-0 text-warning" />
              <p className="text-sm text-warning">
                By confirming, you agree to the laboratory safety guidelines. Please ensure all participants are briefed on safety protocols before the session begins.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              Confirm Booking <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmModal;
