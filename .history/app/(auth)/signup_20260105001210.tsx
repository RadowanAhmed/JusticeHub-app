import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

export default function SignupScreen() {
  const { t, i18n } = useTranslation();
  const { theme, colors, isDarkMode } = useTheme();
  const { signUp: authSignUp } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('empty');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isRTL = i18n.language === 'ar';

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!password) {
      setPasswordStrength('empty');
      return;
    }

    let score = 0;
    
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (password.length >= 10) score++;
    
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) {
      setPasswordStrength('weak');
    } else if (score <= 4) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }, [password]);

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: '',
    };

    let isValid = true;

    if (!firstName.trim()) {
      newErrors.firstName = t('auth.fillAllFields');
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = t('auth.fillAllFields');
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = t('auth.enterEmail');
      isValid = false;
    } else {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        newErrors.email = t('auth.invalidEmail');
        isValid = false;
      }
    }

    if (!password) {
      newErrors.password = t('auth.fillAllFields');
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = t('auth.passwordTooShort');
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('auth.fillAllFields');
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsNotMatch');
      isValid = false;
    }

    if (!acceptedTerms) {
      newErrors.terms = t('auth.acceptTerms');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const showModalError = (message: string) => {
    setModalMessage(message);
    setShowErrorModal(true);
  };

  // Function to send welcome notification
  const sendWelcomeNotification = async (userId: string, userEmail: string, userName: string) => {
    try {
      // Check notification permissions
      const { status } = await Notifications.getPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Notification permission not granted');
        return;
      }

      // Send welcome notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎉 مرحباً بك في Orient Team!",
          body: `أهلاً وسهلاً ${userName}، شكراً لك على الانضمام إلينا!`,
          sound: true,
          badge: 1,
          data: {
            userId: userId,
            type: 'welcome',
            timestamp: new Date().toISOString(),
          },
        },
        trigger: {
          type: 'timeInterval',
          seconds: 1,
          repeats: false,
        },
      });

      console.log('Welcome notification sent successfully');
    } catch (error) {
      console.error('Error sending welcome notification:', error);
    }
  };

  const handleSignup = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Starting signup process...');

      await authSignUp(email, password, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      console.log('🎉 Signup process completed!');

      // Send welcome notification
      // Note: We'll get userId from the auth context after signup
      // For now, we'll send a generic welcome notification
      try {
        // Check notification permissions
        const { status } = await Notifications.getPermissionsAsync();
        
        if (status === 'granted') {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "🎉 مرحباً بك في Orient Team!",
              body: `أهلاً وسهلاً ${firstName}، شكراً لك على الانضمام إلى منصتنا القانونية.`,
              sound: true,
              badge: 1,
            },
            trigger: {
              type: 'timeInterval',
              seconds: 1,
              repeats: false,
            },
          });
        }
      } catch (notifError) {
        console.error('Welcome notification error:', notifError);
      }

      Alert.alert(
        t('common.success'),
        t('auth.welcomeMessage'),
        [
          { 
            text: t('common.continue'), 
            onPress: () => router.replace('/(main)')
          }
        ]
      );

    } catch (error: any) {
      console.error('❌ Signup failed:', error);
      
      // Handle specific errors
      if (error.message?.includes('already registered') || 
          error.message?.includes('User already registered')) {
        showModalError(t('auth.userExists'));
        return;
      }
      
      showModalError(error.message || t('auth.signupFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const isFormValid = email && 
                     password && 
                     confirmPassword && 
                     firstName && 
                     lastName && 
                     password.length >= 6 &&
                     passwordsMatch && 
                     acceptedTerms;

  const openTerms = () => {
    Linking.openURL('https://yourwebsite.com/terms');
  };

  const openPrivacy = () => {
    Linking.openURL('https://yourwebsite.com/privacy');
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return colors.danger;
      case 'medium': return colors.warning;
      case 'strong': return colors.success;
      default: return colors.textTertiary;
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return t('auth.passwordWeak');
      case 'medium': return t('auth.passwordMedium');
      case 'strong': return t('auth.passwordStrong');
      default: return '';
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak': return '33%';
      case 'medium': return '66%';
      case 'strong': return '100%';
      default: return '0%';
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const ErrorModal = () => (
    <Modal
      visible={showErrorModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowErrorModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowErrorModal(false)}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 400,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
            }}>
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.danger + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <Ionicons name="alert-circle" size={32} color={colors.danger} />
              </View>
              
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: colors.textPrimary,
                marginBottom: 12,
                textAlign: 'center',
              }}>
                {t('common.error')}
              </Text>
              
              <Text style={{
                fontSize: 16,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 22,
                marginBottom: 24,
              }}>
                {modalMessage}
              </Text>
              
              <TouchableOpacity
                style={{
                  backgroundColor: colors.danger,
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  borderRadius: 12,
                  width: '100%',
                  alignItems: 'center',
                }}
                onPress={() => setShowErrorModal(false)}
                activeOpacity={0.8}
              >
                <Text style={{
                  color: colors.textInverse,
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  {t('common.ok')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView 
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 40,
              minHeight: SCREEN_HEIGHT,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              {/* Header Section */}
              <View style={{ 
                paddingHorizontal: 20, 
                paddingTop: 60, 
                paddingBottom: 20 
              }}>
                <View style={{ 
                  width: 80, 
                  height: 80, 
                  backgroundColor: colors.elevated, 
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: colors.border
                }}>
                  <Ionicons name="person-add" size={44} color={colors.primary} />
                </View>
                <Text style={{ 
                  color: colors.textPrimary, 
                  fontSize: 28,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: 8 
                }}>{t('auth.createAccount')}</Text>
                <Text style={{ 
                  color: colors.textSecondary, 
                  fontSize: 16,
                  textAlign: 'center',
                  lineHeight: 22 
                }}>
                  {t('auth.signupToContinue')}
                </Text>
              </View>

              {/* Form Section */}
              <View style={{ 
                paddingHorizontal: 20, 
                paddingTop: 10,
                flex: 1 
              }}>
                
                {/* Name Row */}
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={{ 
                      color: colors.textPrimary, 
                      marginBottom: 8,
                      fontWeight: '600',
                      fontSize: 14
                    }}>{t('auth.firstName')}</Text>
                    <View style={{ 
                      backgroundColor: colors.card, 
                      borderColor: errors.firstName ? colors.danger : colors.border,
                      borderWidth: 1.5,
                      borderRadius: 12,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      <Ionicons 
                        name="person-outline" 
                        size={20} 
                        color={colors.textTertiary} 
                        style={{ marginHorizontal: 12 }}
                      />
                      <TextInput
                        style={{ 
                          color: colors.textPrimary, 
                          paddingVertical: 14,
                          fontSize: 16,
                          flex: 1,
                          textAlign: isRTL ? 'right' : 'left',
                          paddingLeft: isRTL ? 12 : 44, 
                          paddingRight: isRTL ? 44 : 12,
                        }}
                        placeholder={t('auth.firstNamePlaceholder')}
                        placeholderTextColor={colors.textTertiary}
                        value={firstName}
                        onChangeText={(text) => {
                          setFirstName(text);
                          setErrors({...errors, firstName: ''});
                        }}
                        editable={!loading}
                        returnKeyType="next"
                      />
                    </View>
                    {errors.firstName ? (
                      <Text style={{
                        color: colors.danger,
                        fontSize: 12,
                        marginTop: 6,
                        marginLeft: 4,
                      }}>
                        {errors.firstName}
                      </Text>
                    ) : null}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      color: colors.textPrimary, 
                      marginBottom: 8,
                      fontWeight: '600',
                      fontSize: 14
                    }}>{t('auth.lastName')}</Text>
                    <View style={{ 
                      backgroundColor: colors.card, 
                      borderColor: errors.lastName ? colors.danger : colors.border,
                      borderWidth: 1.5,
                      borderRadius: 12,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      <Ionicons 
                        name="person-outline" 
                        size={20} 
                        color={colors.textTertiary} 
                        style={{ marginHorizontal: 12 }}
                      />
                      <TextInput
                        style={{ 
                          color: colors.textPrimary, 
                          paddingVertical: 14,
                          fontSize: 16,
                          flex: 1,
                          textAlign: isRTL ? 'right' : 'left',
                          paddingLeft: isRTL ? 12 : 44, 
                          paddingRight: isRTL ? 44 : 12,
                        }}
                        placeholder={t('auth.lastNamePlaceholder')}
                        placeholderTextColor={colors.textTertiary}
                        value={lastName}
                        onChangeText={(text) => {
                          setLastName(text);
                          setErrors({...errors, lastName: ''});
                        }}
                        editable={!loading}
                        returnKeyType="next"
                      />
                    </View>
                    {errors.lastName ? (
                      <Text style={{
                        color: colors.danger,
                        fontSize: 12,
                        marginTop: 6,
                        marginLeft: 4,
                      }}>
                        {errors.lastName}
                    </Text>
                    ) : null}
                  </View>
                </View>

                {/* Email Input */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ 
                    color: colors.textPrimary, 
                    marginBottom: 8,
                    fontWeight: '600',
                    fontSize: 14
                  }}>{t('auth.email')}</Text>
                  <View style={{ 
                    backgroundColor: colors.card, 
                    borderColor: errors.email ? colors.danger : colors.border,
                    borderWidth: 1.5,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <Ionicons 
                      name="mail-outline" 
                      size={20} 
                      color={colors.textTertiary} 
                      style={{ marginHorizontal: 12 }}
                    />
                    <TextInput
                      style={{ 
                        color: colors.textPrimary, 
                        paddingVertical: 14,
                        fontSize: 16,
                        flex: 1,
                        textAlign: isRTL ? 'right' : 'left',
                        paddingLeft: isRTL ? 12 : 44, 
                        paddingRight: isRTL ? 44 : 12,
                      }}
                      placeholder="example@email.com"
                      placeholderTextColor={colors.textTertiary}
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setErrors({...errors, email: ''});
                      }}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      editable={!loading}
                      returnKeyType="next"
                    />
                  </View>
                  {errors.email ? (
                    <Text style={{
                      color: colors.danger,
                      fontSize: 12,
                      marginTop: 6,
                      marginLeft: 4,
                    }}>
                      {errors.email}
                    </Text>
                  ) : null}
                </View>

                {/* Password Input */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ 
                    color: colors.textPrimary, 
                    marginBottom: 8,
                    fontWeight: '600',
                    fontSize: 14
                  }}>{t('auth.password')}</Text>
                  <View style={{ 
                    backgroundColor: colors.card, 
                    borderColor: errors.password ? colors.danger : colors.border,
                    borderWidth: 1.5,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <Ionicons 
                      name="lock-closed-outline" 
                      size={20} 
                      color={colors.textTertiary} 
                      style={{ marginHorizontal: 12 }}
                    />
                    <TextInput
                      style={{ 
                        color: colors.textPrimary, 
                        paddingVertical: 14,
                        fontSize: 16,
                        flex: 1,
                        textAlign: isRTL ? 'right' : 'left',
                        paddingLeft: isRTL ? 12 : 44,
                        paddingRight: isRTL ? 44  : 48,
                      }}
                      placeholder="••••••••"
                      placeholderTextColor={colors.textTertiary}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setErrors({...errors, password: ''});
                      }}
                      secureTextEntry={!showPassword}
                      editable={!loading}
                      returnKeyType="next"
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        right: 12,
                        padding: 8,
                      }}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={22} 
                        color={colors.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  {errors.password ? (
                    <Text style={{
                      color: colors.danger,
                      fontSize: 12,
                      marginTop: 6,
                      marginLeft: 4,
                    }}>
                      {errors.password}
                    </Text>
                  ) : null}
                  
                  {/* Password Strength */}
                  {password.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ 
                          flex: 1, 
                          height: 4, 
                          backgroundColor: colors.border,
                          borderRadius: 2,
                          overflow: 'hidden',
                          marginRight: 8
                        }}>
                          <View 
                            style={{
                              height: '100%',
                              width: getStrengthWidth(),
                              backgroundColor: getStrengthColor(),
                              borderRadius: 2,
                            }} 
                          />
                        </View>
                        <Text style={{ 
                          color: getStrengthColor(), 
                          fontSize: 12,
                          fontWeight: '600'
                        }}>
                          {getStrengthText()}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Confirm Password Input */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ 
                    color: colors.textPrimary, 
                    marginBottom: 8,
                    fontWeight: '600',
                    fontSize: 14
                  }}>{t('auth.confirmPassword')}</Text>
                  <View style={{ 
                    backgroundColor: colors.card, 
                    borderColor: errors.confirmPassword ? colors.danger : colors.border,
                    borderWidth: 1.5,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <Ionicons 
                      name="lock-closed-outline" 
                      size={20} 
                      color={colors.textTertiary} 
                      style={{ marginHorizontal: 12 }}
                    />
                    <TextInput
                      style={{ 
                        color: colors.textPrimary, 
                        paddingVertical: 14,
                        fontSize: 16,
                        flex: 1,
                        textAlign: isRTL ? 'right' : 'left',
                        paddingLeft: isRTL ? 12 : 44,
                        paddingRight: isRTL ? 44  : 48,
                      }}
                      placeholder="••••••••"
                      placeholderTextColor={colors.textTertiary}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        setErrors({...errors, confirmPassword: ''});
                      }}
                      secureTextEntry={!showConfirmPassword}
                      editable={!loading}
                      returnKeyType="done"
                      onSubmitEditing={handleSignup}
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        right: 12,
                        padding: 8,
                      }}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      <Ionicons 
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                        size={22} 
                        color={colors.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  {errors.confirmPassword ? (
                    <Text style={{
                      color: colors.danger,
                      fontSize: 12,
                      marginTop: 6,
                      marginLeft: 4,
                    }}>
                      {errors.confirmPassword}
                    </Text>
                  ) : password && confirmPassword && passwordsMatch ? (
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      marginTop: 8 
                    }}>
                      <Ionicons 
                        name="checkmark-circle" 
                        size={16} 
                        color={colors.success} 
                      />
                      <Text style={{ 
                        color: colors.success,
                        fontSize: 12,
                        marginLeft: 6
                      }}>
                        {t('auth.passwordsMatch')}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Terms & Conditions */}
                <View style={{ marginBottom: 24 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Checkbox
                      value={acceptedTerms}
                      onValueChange={(value) => {
                        setAcceptedTerms(value);
                        setErrors({...errors, terms: ''});
                      }}
                      color={acceptedTerms ? colors.primary : undefined}
                      style={{ 
                        width: 20, 
                        height: 20,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: acceptedTerms ? colors.primary : colors.textTertiary,
                        marginTop: 2
                      }}
                      disabled={loading}
                    />
                    <Text style={{ 
                      color: colors.textPrimary, 
                      fontSize: 14,
                      marginLeft: 12,
                      flex: 1,
                      lineHeight: 20
                    }}>
                      {t('auth.agreeTerms')}{' '}
                      <Text 
                        style={{ 
                          color: colors.primary,
                          textDecorationLine: 'underline'
                        }} 
                        onPress={openTerms}
                      >
                        {t('auth.terms')}
                      </Text>
                      {' '}{t('auth.and')}{' '}
                      <Text 
                        style={{ 
                          color: colors.primary,
                          textDecorationLine: 'underline'
                        }} 
                        onPress={openPrivacy}
                      >
                        {t('auth.privacyPolicy')}
                      </Text>
                    </Text>
                  </View>
                  {errors.terms ? (
                    <Text style={{
                      color: colors.danger,
                      fontSize: 12,
                      marginTop: 6,
                      marginLeft: 32,
                    }}>
                      {errors.terms}
                    </Text>
                  ) : null}
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: isFormValid ? colors.primary : colors.border,
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isFormValid ? 1 : 0.6,
                    marginBottom: 24
                  }}
                  onPress={handleSignup}
                  disabled={loading || !isFormValid}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.textInverse} size="small" />
                  ) : (
                    <Text style={{ 
                      color: colors.textInverse, 
                      fontSize: 16,
                      fontWeight: '600'
                    }}>{t('common.signup')}</Text>
                  )}
                </TouchableOpacity>

                {/* Login Link */}
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 8
                }}>
                  <Text style={{ 
                    color: colors.textSecondary, 
                    fontSize: 15
                  }}>
                    {t('auth.haveAccount')}{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/(auth)/login')}
                    disabled={loading}
                  >
                    <Text style={{ 
                      color: colors.primary, 
                      fontSize: 15,
                      fontWeight: '600'
                    }}>{t('common.login')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <ErrorModal />
    </View>
  );
}