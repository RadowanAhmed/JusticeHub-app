// apps/mobile/app/index.tsx
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  
  // Animation values
  const [iconScale] = useState(new Animated.Value(0));
  const [iconRotation] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));
  const [letterAnims] = useState(
    "ORIENT".split('').map(() => new Animated.Value(0))
  );
  const [iconGlow] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      Animated.timing(iconGlow, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      Animated.stagger(80,
        letterAnims.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 180,
            friction: 8,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();

    // Redirect after animation
    const redirectTimeout = setTimeout(() => {
      // Just go to auth, let the auth layout handle redirects
      router.replace('/(auth)/login');
    }, 3500);

    return () => clearTimeout(redirectTimeout);
  }, [router]);

  // Animation transformations
  const iconRotationInterpolate = iconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-30deg', '0deg'],
  });

  const iconGlowInterpolate = iconGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const getLetterAnimation = (index: number) => ({
    opacity: letterAnims[index],
    transform: [
      {
        translateY: letterAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[
          styles.iconContainer,
          {
            transform: [
              { scale: iconScale },
              { rotate: iconRotationInterpolate },
            ],
          }
        ]}>
          <Animated.View style={[
            styles.iconGlow,
            {
              opacity: iconGlowInterpolate,
              transform: [{ scale: iconGlowInterpolate.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              })}],
            }
          ]} />
          <Text style={styles.icon}>⚖️</Text>
        </Animated.View>

        <Animated.View style={[
          styles.textContainer,
          { opacity: textOpacity }
        ]}>
          <View style={styles.orientContainer}>
            {"ORIENT".split('').map((letter, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.letter,
                  getLetterAnimation(index),
                  index === 0 && styles.firstLetter,
                  index === 2 && styles.middleLetter,
                  index === 5 && styles.lastLetter,
                ]}
              >
                {letter}
              </Animated.Text>
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 70,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    zIndex: -1,
  },
  icon: {
    fontSize: 72,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  orientContainer: {
    flexDirection: 'row',
      direction: 'ltr', // 👈 الحل هنا

  },
  letter: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginHorizontal: 2,
    letterSpacing: 1,
  },
  firstLetter: {
    color: '#60A5FA',
  },
  middleLetter: {
    color: '#C7D2FE',
  },
  lastLetter: {
    color: '#93C5FD',
  },
});