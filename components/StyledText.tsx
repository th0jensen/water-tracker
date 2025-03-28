import {Text, TextProps} from './Themed.tsx';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, {fontFamily: 'SpaceMono'}]} />;
}
