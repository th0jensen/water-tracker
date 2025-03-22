import Units, {type UnitsType} from '@/models/Units';
import Activity, {type ActivityType} from '@/models/Activity';

namespace Calculations {
  const calculateBaseHydration = (weight: number, unit: UnitsType): number => {
    switch (unit) {
      case Units.Metric:
        return 33 * weight;
      case Units.Imperial:
        return 0.5 * weight;
      default:
        return 33 * weight;
    }
  };

  const adjustForActivity = (activity: ActivityType, unit: UnitsType): number => {
    switch (unit) {
      case Units.Metric:
        switch (activity) {
          case Activity.Sedentary:
            return 0;
          case Activity.Active:
            return 500;
          case Activity.Athlete:
            return 900;
          default:
            return 0;
        }
      case Units.Imperial:
        switch (activity) {
          case Activity.Sedentary:
            return 0;
          case Activity.Active:
            return 17;
          case Activity.Athlete:
            return 30;
          default:
            return 0;
        }
      default:
        return 0;
    }
  };

  export const calculateDailyHydration = (
    weight: string,
    activity: ActivityType,
    unit: UnitsType
  ): number => {
    const weightNum = parseFloat(weight);
    if (!weightNum) {
      return 0;
    }

    let total = calculateBaseHydration(weightNum, unit);
    total += adjustForActivity(activity, unit);

    total = Math.round(total);

    return total;
  };

  export const calculateBmi = (weight: string, height: string): number => {
    return 0;
  };
}

export default Calculations;
