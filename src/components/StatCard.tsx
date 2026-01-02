import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  icon: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
}

const StatCard = ({ label, value, sublabel, icon: Icon, iconClassName, valueClassName }: StatCardProps) => {
  return (
    <div className="card-elevated p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className={cn('text-xs font-semibold uppercase tracking-wide', valueClassName || 'text-primary')}>
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{sublabel}</p>
        </div>
        <div className={cn('rounded-xl p-2.5', iconClassName || 'bg-primary/10')}>
          <Icon className={cn('h-5 w-5', valueClassName || 'text-primary')} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
