import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleProp,
  useColorScheme,
  Dimensions,
} from 'react-native';

export type PickerItem = {label: string; value: string};

interface HorizontalPickerProps {
  label?: string; // Kept for API compatibility, but won't be used
  value: string;
  onValueChange: (value: string) => void;
  items: {label: string; value: string}[];
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const HorizontalPicker: React.FC<HorizontalPickerProps> = ({
  value,
  onValueChange,
  items,
  style,
  itemStyle,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  const handleFocus = (): void => setIsFocused(true);
  const handleBlur = (): void => setIsFocused(false);

  const segmentWidth = (SCREEN_WIDTH * 0.9) / items.length; // Full width divided by item count

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.pickerContainer,
          {
            backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#fff',
            borderColor: colorScheme === 'dark' ? '#374151' : '#d1d5db',
          },
          disabled && styles.disabled,
        ]}
        onTouchStart={handleFocus}
        onTouchEnd={handleBlur}
      >
        <View style={styles.segmentWrapper}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => !disabled && onValueChange(item.value)}
              disabled={disabled}
              style={[
                styles.segment,
                {
                  width: segmentWidth,
                  borderLeftWidth: index === 0 ? 0 : 1, // No left border on first item
                  borderColor: colorScheme === 'dark' ? '#4b5563' : '#d1d5db',
                  backgroundColor:
                    item.value === value
                      ? colorScheme === 'dark'
                        ? '#3b82f6' // Selected segment in dark mode
                        : '#3b82f6' // Selected segment in light mode
                      : colorScheme === 'dark'
                        ? '#1f2937' // Unselected in dark mode
                        : '#fff', // Unselected in light mode
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  {
                    color:
                      item.value === value
                        ? '#fff' // White text for selected segment
                        : colorScheme === 'dark'
                          ? '#fff'
                          : '#1f2937',
                  },
                  itemStyle,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9, // Matches TextField
    marginVertical: 12,
  },
  pickerContainer: {
    width: '100%',
    height: 45, // Matches TextField height
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden', // Ensure segments don't bleed outside
  },
  segmentWrapper: {
    flexDirection: 'row',
    height: '100%', // Fill container height
    width: '100%', // Fill container width
  },
  segment: {
    height: '100%', // Full height of container
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.7,
  },
});

export default HorizontalPicker;
