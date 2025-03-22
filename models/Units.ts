import {z} from 'zod';
import type {PickerItem} from '@/components/HorizontalPicker';

enum Units {
  Metric = 'metric',
  Imperial = 'imperial',
}

namespace UnitsImpl {
  export const variants = (): Units[] =>
    Object.values(Units).filter(value => typeof value === 'string') as Units[];

  export const toPickerItems = (): PickerItem[] =>
    variants().map(unit => ({
      label: unit.charAt(0).toUpperCase() + unit.slice(1),
      value: unit,
    }));

  export const toHeight = (unit: Units) => (unit === Units.Metric ? 'cm' : 'inches');
  export const toWeight = (unit: Units) => (unit === Units.Metric ? 'kg' : 'lbs');

  export const schema = z.enum([Units.Metric, Units.Imperial]);

  export const validate = (value: string): Units | undefined => {
    const result = UnitsImpl.schema.safeParse(value);
    if (result.success) {
      return result.data;
    } else {
      console.warn('Invalid unit value:', value);
      return undefined;
    }
  };
}

export type UnitsType = Units;

export default {
  ...Units,
  ...UnitsImpl,
};
