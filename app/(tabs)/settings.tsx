import {StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {useEffect, useState} from 'react';
import {z} from 'zod';

import {Text, View} from '@/components/Themed.tsx';
import TextField from '@/components/TextField.tsx';
import HorizontalPicker from '@/components/HorizontalPicker.tsx';

import Units, {type UnitsType} from '@/models/Units';
import Activity, {type ActivityType} from '@/models/Activity';
import Calculations from '@/models/Calculations';
import Colors from '@/constants/Colors';
import {useAtom} from 'jotai';
import {
  unitAtom,
  hydrationGoalAtom,
  activityAtom,
  heightAtom,
  weightAtom,
} from '@/atoms/SettingsAtoms';

const NumericStringSchema = z
  .string()
  .refine(val => !isNaN(Number(val)), {message: 'Must be a valid number'})
  .transform(val => Number(val));

const validateNumericString = (text: string): string | undefined => {
  if (text === '') {
    return '';
  }

  const result = NumericStringSchema.safeParse(text);
  if (result.success) {
    return result.data.toString();
  } else {
    console.warn('Invalid type:', result.error.message);
    return undefined;
  }
};

export default function SettingsScreen() {
  const [unit, setUnit] = useAtom(unitAtom);
  const [activity, setActivity] = useAtom(activityAtom);
  const [height, setHeight] = useAtom(heightAtom);
  const [weight, setWeight] = useAtom(weightAtom);
  const [hydration, setHydration] = useAtom(hydrationGoalAtom);
  const [bmi, setBmi] = useState<number | null>(null);
  const [originalHeight, setOriginalHeight] = useState<number | null>(null);
  const [originalWeight, setOriginalWeight] = useState<number | null>(null);
  const [originalUnit, setOriginalUnit] = useState<UnitsType>(Units.Metric);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleUnitChange = (value: string) => {
    const validatedUnit = Units.validate(value);
    if (validatedUnit && originalHeight !== null && originalWeight !== null) {
      switch (originalUnit) {
        case Units.Metric:
          if (validatedUnit === Units.Imperial) {
            setHeight(Math.round(originalHeight / 2.54).toString());
            setWeight(Math.round(originalWeight * 2.205).toString());
          } else {
            setHeight(originalHeight.toString());
            setWeight(originalWeight.toString());
          }
          break;
        case Units.Imperial:
          if (validatedUnit === Units.Metric) {
            setHeight(Math.round(originalHeight * 2.54).toString());
            setWeight(Math.round(originalWeight / 2.205).toString());
          } else {
            setHeight(originalHeight.toString());
            setWeight(originalWeight.toString());
          }
          break;
      }
      setUnit(validatedUnit);
    } else if (validatedUnit) {
      setUnit(validatedUnit);
    }
  };

  const handleActivityChange = (value: string) => {
    const validatedActivity = Activity.validate(value);
    if (validatedActivity) {
      setActivity(validatedActivity);
    }
  };

  const handleHeightChange = (value: string) => {
    const validatedHeight = validateNumericString(value);
    if (validatedHeight !== undefined) {
      setHeight(validatedHeight);
      const parsedHeight = parseInt(validatedHeight);
      if (!isNaN(parsedHeight)) {
        setOriginalHeight(parsedHeight);
        setOriginalUnit(unit);
      }
    }
  };

  const handleWeightChange = (value: string) => {
    const validatedWeight = validateNumericString(value);
    if (validatedWeight !== undefined) {
      setWeight(validatedWeight);
      const parsedWeight = parseInt(validatedWeight);
      if (!isNaN(parsedWeight)) {
        setOriginalWeight(parsedWeight);
        setOriginalUnit(unit);
      }
    }
  };

  useEffect(() => {
    setHydration(Calculations.calculateDailyHydration(weight, activity, unit));
    setBmi(Calculations.calculateBmi(weight, height));
  }, [weight, height, unit]);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View onStartShouldSetResponder={() => true} style={styles.inputWrapper}>
          <HorizontalPicker
            value={unit}
            onValueChange={handleUnitChange}
            items={Units.toPickerItems()}
          />
        </View>
        <View onStartShouldSetResponder={() => true} style={styles.inputWrapper}>
          <TextField
            label={`Height (${Units.toHeight(unit)})`}
            keyboardType="numeric"
            value={height}
            onChangeText={handleHeightChange}
          />
        </View>
        <View onStartShouldSetResponder={() => true} style={styles.inputWrapper}>
          <TextField
            label={`Weight (${Units.toWeight(unit)})`}
            keyboardType="numeric"
            value={weight}
            onChangeText={handleWeightChange}
          />
        </View>
        <View onStartShouldSetResponder={() => true} style={styles.inputWrapper}>
          <HorizontalPicker
            value={activity}
            onValueChange={handleActivityChange}
            items={Activity.toPickerItems()}
          />
        </View>
        <View style={styles.hydrationWrapper}>
          <Text style={styles.hydrationText}>
            {hydration} {Units.toLiquid(unit)}
          </Text>
          <Text style={styles.bmiText}>BMI: {bmi}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  hydrationWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  hydrationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  bmiText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
});
