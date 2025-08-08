import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '@/lib/utils';

const RadioGroup = RadioGroupPrimitive.Root;

const Radio = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'peer h-4 w-4 rounded-full border border-gray-300 bg-white ' +
        'flex items-center justify-center ' +
        'focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
        'peer-checked:border-transparent',
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="h-2 w-2 rounded-full bg-blue-500" />
  </RadioGroupPrimitive.Item>
));
Radio.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, Radio };
