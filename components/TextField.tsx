import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  TextInputProps,
  ViewStyle,
  TextStyle,
  StyleProp,
  useColorScheme,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  inputStyle,
  disabled = false,
  autoCapitalize = 'none',
  multiline = false,
  ...rest
}) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [animatedIsFocused] = useState<Animated.Value>(new Animated.Value(value ? 1 : 0));
  const colorScheme = useColorScheme();

  const handleFocus = (): void => setIsFocused(true);
  const handleBlur = (): void => setIsFocused(false);

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || !!value || value != '' ? 1 : 0, // Animate to "focused" style if focused OR has value
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, animatedIsFocused]);

  const labelStyle: any = {
    position: 'absolute',
    left: 16,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [22, 12], // Adjusted for more space
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [colorScheme === 'dark' ? '#9ca3af' : '#6b7280', '#3b82f6'],
    }),
    zIndex: 1,
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!disabled && inputRef.current) {
          inputRef.current.focus();
        }
      }}
      accessibilityRole="button"
    >
      <View style={[styles.container, style]}>
        {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}
        <TextInput
          ref={inputRef} // Add ref here
          style={[
            styles.input,
            isFocused && styles.focused,
            error && styles.errorInput,
            disabled && styles.disabled,
            {
              backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#fff',
              color: colorScheme === 'dark' ? '#fff' : '#1f2937',
              borderColor: colorScheme === 'dark' ? '#374151' : '#d1d5db',
            },
            inputStyle,
          ]}
          placeholder={isFocused ? placeholder : ''}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={!disabled}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
          accessibilityLabel={label}
          accessibilityHint={placeholder}
          accessibilityState={{disabled}}
          {...rest}
        />
        {error && <Text style={[styles.errorText, {color: '#ef4444'}]}>{error}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9, // 90% of screen width
    marginVertical: 12, // More vertical spacing between fields
  },
  input: {
    width: '100%',
    height: 75,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16, // Symmetrical horizontal padding
    paddingTop: 20, // More top padding to accommodate label
    paddingBottom: 12, // Balanced bottom padding
    fontSize: 16,
  },
  focused: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  errorInput: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    marginTop: 6, // More space for error text
    marginLeft: 16,
  },
  disabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    opacity: 0.7,
  },
});

export default TextField;
