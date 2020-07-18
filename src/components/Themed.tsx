import * as React from 'react';
import { Text as DefaultText, View as DefaultView, SafeAreaView as DefaultSafeAreaView } from 'react-native';

import Colors from '../constants/Colors';

export function useThemeColor(
  props: { light?: string; },
  colorName: keyof typeof Colors.light
) {
  const theme = 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function SafeAreaView(props: ViewProps) {
  const { style, lightColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor }, 'background');

  return <DefaultSafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}
