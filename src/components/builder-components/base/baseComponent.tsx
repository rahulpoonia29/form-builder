import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BaseComponentProps } from '@/types/formComponent';

// Props for the component including base props
export interface BaseComponentPropsType extends BaseComponentProps {
  children: React.ReactNode;
}

// The actual component that will be rendered in the form
export default function BaseComponent({
  label,
  required,
  helperText,
  className,
  children,
}: BaseComponentPropsType) {
  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="flex items-center gap-1">
        <Label className="text-sm">
          {label}
          {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
        </Label>
      </div>
      {children}
      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
      {required && (
        <span className="sr-only">(Required field)</span>
      )}
    </div>
  );
}
