import Units, {type UnitsType} from '@/models/Units';
import {atomWithStorage, createJSONStorage} from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Activity, {ActivityType} from '@/models/Activity';

const unitStorage = createJSONStorage<UnitsType>(() => AsyncStorage);
const activityStorage = createJSONStorage<ActivityType>(() => AsyncStorage);
const numberStorage = createJSONStorage<number>(() => AsyncStorage);
const stringStorage = createJSONStorage<string>(() => AsyncStorage);

export const unitAtom = atomWithStorage<UnitsType>('selectedUnit', Units.Metric, unitStorage);
export const hydrationGoalAtom = atomWithStorage<number>('hydrationGoal', 0, numberStorage);
export const heightAtom = atomWithStorage<string>('height', '', stringStorage);
export const weightAtom = atomWithStorage<string>('weight', '', stringStorage);
export const activityAtom = atomWithStorage<ActivityType>(
  'activity',
  Activity.Active,
  activityStorage
);
