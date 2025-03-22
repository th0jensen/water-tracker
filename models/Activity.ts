import {z} from 'zod';
import type {PickerItem} from '@/components/HorizontalPicker';

enum Activity {
  Sedentary = 'sedentary',
  Active = 'active',
  Athlete = 'athlete',
}

namespace ActivityImpl {
  export const variants = (): Activity[] =>
    Object.values(Activity).filter(value => typeof value === 'string') as Activity[];

  export const toPickerItems = (): PickerItem[] =>
    variants().map(activity => ({
      label: activity.charAt(0).toUpperCase() + activity.slice(1),
      value: activity,
    }));

  export const schema = z.enum([Activity.Sedentary, Activity.Active, Activity.Athlete]);

  export const validate = (value: string): Activity | undefined => {
    const result = ActivityImpl.schema.safeParse(value);
    if (result.success) {
      return result.data;
    } else {
      console.warn('Invalid activity value:', value);
      return undefined;
    }
  };
}

export type ActivityType = Activity;

export default {
  ...Activity,
  ...ActivityImpl,
};
