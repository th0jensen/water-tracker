import {StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {useState} from 'react';
import {z} from 'zod';

import {Text, View} from '@/components/Themed.tsx';
import TextField from '@/components/TextField.tsx';
import HorizontalPicker from '@/components/HorizontalPicker.tsx';

import Units, {type UnitsType} from '@/models/Units';
import Activity, {type ActivityType} from '@/models/Activity';

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
  const [unit, setUnit] = useState<UnitsType>(Units.Metric);
  const [activity, setActivity] = useState<ActivityType>(Activity.Active);
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleUnitChange = (value: string) => {
    const validatedUnit = Units.validate(value);
    if (validatedUnit) {
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
    }
  };

  const handleWeightChange = (value: string) => {
    const validatedWeight = validateNumericString(value);
    if (validatedWeight !== undefined) {
      setWeight(validatedWeight);
    }
  };

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
});
