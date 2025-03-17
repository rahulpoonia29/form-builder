import { PropertyInput } from '@/components/form-builder/properties';
import BaseComponent from '@/components/form-components/base/baseComponent';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';
import {
  BaseComponentConfig,
  BaseComponentProps,
  Component,
} from '@/types/form';
import React from 'react';

interface OTPInputProps extends BaseComponentProps {
  length: number;
  isNumeric: boolean;
  showGroups: boolean;
  groupSize: number;
  autoFocus: boolean;
}

export function OTPInput({
  label,
  required,
  helperText,
  length = 6,
  isNumeric = true,
  showGroups = true,
  groupSize = 3,
  autoFocus = false,
  className,
}: OTPInputProps) {
  // Generate slots based on the length
  const renderOTPSlots = () => {
    if (!showGroups) {
      // Render all slots in a single group
      return (
        <InputOTPGroup>
          {Array.from({ length }).map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      );
    }

    // Calculate how many groups we need
    const groups = [];
    for (let i = 0; i < length; i += groupSize) {
      const group = (
        <React.Fragment key={i}>
          {i > 0 && <InputOTPSeparator />}
          <InputOTPGroup>
            {Array.from({ length: Math.min(groupSize, length - i) }).map(
              (_, j) => (
                <InputOTPSlot key={j} index={i + j} />
              ),
            )}
          </InputOTPGroup>
        </React.Fragment>
      );
      groups.push(group);
    }
    return groups;
  };

  return (
    <BaseComponent {...{ label, required, helperText }}>
      <InputOTP
        maxLength={length}
        pattern={isNumeric ? '[0-9]' : undefined}
        autoFocus={autoFocus}
        className={cn(className)}
      >
        {renderOTPSlots()}
      </InputOTP>
    </BaseComponent>
  );
}

const renderPropertiesEditor = (
  props: OTPInputProps,
  onChange: (props: OTPInputProps) => void,
) => (
  <>
    <PropertyInput
      label="Length"
      name="length"
      type="number"
      value={props.length}
      onChange={(value) => onChange({ ...props, length: Number(value) })}
    />
    <PropertyInput
      label="Numeric Only"
      name="isNumeric"
      type="boolean"
      value={props.isNumeric}
      onChange={(value) => onChange({ ...props, isNumeric: Boolean(value) })}
    />
    <PropertyInput
      label="Show Groups"
      name="showGroups"
      type="boolean"
      value={props.showGroups}
      onChange={(value) => onChange({ ...props, showGroups: Boolean(value) })}
    />
    {props.showGroups && (
      <PropertyInput
        label="Group Size"
        name="groupSize"
        type="number"
        value={props.groupSize}
        onChange={(value) => onChange({ ...props, groupSize: Number(value) })}
      />
    )}
    <PropertyInput
      label="Auto Focus"
      name="autoFocus"
      type="boolean"
      value={props.autoFocus}
      onChange={(value) => onChange({ ...props, autoFocus: Boolean(value) })}
    />
  </>
);

const generateSchemaCode = (
  component: Component<OTPInputProps, Record<string, unknown>>,
): string => {
  const length = component.props.length;
  const validationPattern = component.props.isNumeric ? '^\\d+$' : undefined;

  return `${component.name}: z.string()${
    component.props.required
      ? '.length(' + length + ", { message: 'Please enter a valid OTP code' })"
      : '.optional()'
  }${
    validationPattern
      ? `.regex(/${validationPattern}/, { message: 'OTP must contain only digits' })`
      : ''
  },`;
};

const generateJSXCode = (
  component: Component<OTPInputProps, Record<string, unknown>>,
): string => {
  const { showGroups, length, groupSize } = component.props;
  let slotCode = '';

  if (!showGroups) {
    slotCode = `<InputOTPGroup>\n    ${Array.from({ length })
      .map((_, i) => `<InputOTPSlot index={${i}} />`)
      .join('\n    ')}\n  </InputOTPGroup>`;
  } else {
    const groups = [];
    for (let i = 0; i < length; i += groupSize) {
      const groupCode = `  ${i > 0 ? '<InputOTPSeparator />\n  ' : ''}<InputOTPGroup>\n    ${Array.from(
        { length: Math.min(groupSize, length - i) },
      )
        .map((_, j) => `<InputOTPSlot index={${i + j}} />`)
        .join('\n    ')}\n  </InputOTPGroup>`;
      groups.push(groupCode);
    }
    slotCode = groups.join('\n  ');
  }

  return `<InputOTP 
maxLength={${length}}
${component.props.isNumeric ? 'pattern="[0-9]"' : ''}
${component.props.autoFocus ? 'autoFocus' : ''}
name="${component.name}"
${component.props.required ? 'required' : ''}
>
${slotCode}
</InputOTP>`;
};

const generateImportCode = () => {
  return `import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";`;
};

const OTPInputConfig: BaseComponentConfig<
  OTPInputProps,
  Record<string, unknown>
> = {
  name: 'otp',
  description: 'One-time password input field',
  component: OTPInput,
  defaultProps: {
    label: 'OTP Code',
    required: true,
    length: 6,
    isNumeric: true,
    showGroups: true,
    groupSize: 3,
    autoFocus: false,
    helperText: 'Enter the verification code',
    className: '',
  },
  customOptions: {},
  renderPropertiesEditor: renderPropertiesEditor,
  generateJSXCode: generateJSXCode,
  generateSchemaCode: generateSchemaCode,
  generateImportCode: generateImportCode,
};

export default OTPInputConfig;
