'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormComponentProps } from '@/lib/form-components';
import { cn } from '@/lib/utils';

export interface FormPreviewComponentProps {
  component: FormComponentProps;
  className?: string;
}

export const FormPreviewComponent = ({
  component,
  className,
}: FormPreviewComponentProps) => {
  const { type, props } = component;
  const { label, placeholder, helperText, required, options } = props;

  const renderFormComponent = () => {
    switch (type) {
      case 'text':
        return (
          <Input
            placeholder={placeholder}
            disabled
            className="pointer-events-none bg-muted/50"
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={placeholder}
            disabled
            className="pointer-events-none resize-none bg-muted/50"
            rows={3}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={placeholder}
            disabled
            className="pointer-events-none bg-muted/50"
          />
        );
      case 'email':
        return (
          <Input
            type="email"
            placeholder={placeholder}
            disabled
            className="pointer-events-none bg-muted/50"
          />
        );
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger className="pointer-events-none bg-muted/50">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={`preview-${component.id}`} disabled />
            <Label htmlFor={`preview-${component.id}`} className="text-sm">
              {label}
            </Label>
          </div>
        );
      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch id={`preview-${component.id}`} disabled />
            <Label htmlFor={`preview-${component.id}`} className="text-sm">
              {label}
            </Label>
          </div>
        );
      case 'date':
        return (
          <Input
            type="date"
            disabled
            className="pointer-events-none bg-muted/50"
          />
        );
      case 'radio':
        return (
          <div className="flex flex-col space-y-1">
            {options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="size-4 rounded-full border border-primary/50" />
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        );
      case 'spacer':
        return <div className="h-4" />;
      default:
        return null;
    }
  };

  // For checkbox and switch, we don't render the label separately
  if (type === 'checkbox' || type === 'switch') {
    return (
      <div className={cn('w-full', className)}>
        {renderFormComponent()}
        {helperText && (
          <p className="text-muted-foreground text-xs mt-1">{helperText}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="flex items-center gap-1">
        <Label className="text-sm">{label}</Label>
        {required && <span className="text-destructive">*</span>}
      </div>
      {renderFormComponent()}
      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
    </div>
  );
};
