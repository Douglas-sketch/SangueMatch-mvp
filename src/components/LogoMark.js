import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { colors, fonts, shadow } from '../constants/theme';

export default function LogoMark({ size = 92, animated = false, label = false }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (animated) {
      scale.value = withRepeat(withSequence(withTiming(1.08, { duration: 700 }), withTiming(1, { duration: 700 })), -1, true);
    }
  }, [animated, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.wrapper} accessible accessibilityRole="image" accessibilityLabel="Logo do SangueMatch, coração vermelho com cruz branca">
      <Animated.View style={[styles.mark, { width: size, height: size, borderRadius: size / 3 }, animatedStyle]}>
        <Text style={[styles.heart, { fontSize: size * 0.55 }]}>♥</Text>
        <Text style={[styles.cross, { fontSize: size * 0.34 }]}>✚</Text>
      </Animated.View>
      {label ? <Text style={styles.label}>SangueMatch</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    ...shadow,
  },
  heart: {
    color: '#fff',
    marginTop: -2,
    fontFamily: fonts.displayBold,
  },
  cross: {
    color: colors.primary,
    position: 'absolute',
    fontFamily: fonts.displayBold,
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  label: {
    marginTop: 14,
    fontFamily: fonts.displayBold,
    color: colors.secondary,
    fontSize: 28,
  },
});
