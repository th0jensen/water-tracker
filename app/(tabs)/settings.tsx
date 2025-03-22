import {StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {useState} from 'react';
import {Text, View} from '@/components/Themed.tsx';
import TextField from '@/components/TextField.tsx';
import HorizontalPicker from '@/components/HorizontalPicker.tsx';

enum Units {
  Metric = 'metric',
  Imperial = 'imperial',
}

namespace Units {
  export const variants = (): Units[] =>
    Object.values(Units).filter(value => typeof value === 'string') as Units[];

  type PickerItem = {label: string; value: string};
  export const toPickerItems = (): PickerItem[] =>
    variants().map(unit => ({
      label: unit === Units.Metric ? 'Metric' : 'Imperial',
      value: unit,
    }));

  type ToHeightProps = (unit: Units) => 'cm' | 'inches';
  export const toHeight: ToHeightProps = unit => (unit === Units.Metric ? 'cm' : 'inches');

  type ToWeightProps = (unit: Units) => 'kg' | 'lbs';
  export const toWeight: ToWeightProps = unit => (unit === Units.Metric ? 'kg' : 'lbs');
}

export default function SettingsScreen() {
  const [unit, setUnit] = useState<Units>(Units.Metric);
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <View onStartShouldSetResponder={() => true} style={styles.inputWrapper}>
          <HorizontalPicker
            value={unit}
            onValueChange={(value: string) => setUnit(value as Units)}
            items={Units.toPickerItems()}
          />
        </View>
        <View onStartShouldSetResponder={() => true} style={styles.inputWrapper}>
          <TextField
            label="Height"
            placeholder={`Enter height in ${Units.toHeight(unit)}`}
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>
        <View onStartShouldSetResponder={() => true} style={styles.inputWrapper}>
          <TextField
            label="Weight"
            placeholder={`Enter weight in ${Units.toWeight(unit)}`}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
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
