import { authNotificationService } from "@/backend/services/AuthNotificationService";
import { fcmService } from '@/backend/services/FCMService';
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, User } from "@supabase/supabase-js";
import * as Device from 'expo-device';
import { useRouter } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert, Platform } from "react-native";



interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender?: string;
  country?: string;
  city?: string;
  address?: string;
  bio?: string;
  is_completed: boolean;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: {
      first_name: string;
      last_name: string;
    }
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Keys for AsyncStorage
const SESSION_KEYS = {
  USER_ID: 'user_id',
  USER_EMAIL: 'user_email',
  SESSION_TOKEN: 'session_token',
  PROFILE_DATA: 'profile_data'
};

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Save session to AsyncStorage
  const saveSession = async (userData: User, sessionData: Session) => {
    try {
      await AsyncStorage.multiSet([
        [SESSION_KEYS.USER_ID, userData.id],
        [SESSION_KEYS.USER_EMAIL, userData.email || ''],
        [SESSION_KEYS.SESSION_TOKEN, sessionData.access_token],
      ]);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  // Save profile to AsyncStorage
  const saveProfile = async (profileData: UserProfile) => {
    try {
      await AsyncStorage.setItem(
        SESSION_KEYS.PROFILE_DATA, 
        JSON.stringify(profileData)
      );
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Clear session from AsyncStorage
  const clearSession = async () => {
    try {
      await AsyncStorage.multiRemove([
        SESSION_KEYS.USER_ID,
        SESSION_KEYS.USER_EMAIL,
        SESSION_KEYS.SESSION_TOKEN,
        SESSION_KEYS.PROFILE_DATA,
      ]);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };

  // Load session from AsyncStorage
  const loadSavedSession = async () => {
    try {
      const [userId, userEmail, sessionToken, profileData] = await AsyncStorage.multiGet([
        SESSION_KEYS.USER_ID,
        SESSION_KEYS.USER_EMAIL,
        SESSION_KEYS.SESSION_TOKEN,
        SESSION_KEYS.PROFILE_DATA,
      ]);

      if (userId[1] && sessionToken[1]) {
        // Try to restore session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (!sessionError && currentSession) {
          // Session exists, use it
          return {
            session: currentSession,
            profile: profileData[1] ? JSON.parse(profileData[1]) : null
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading saved session:', error);
      return null;
    }
  };

  // SIMPLIFIED: Create profile in database
  const createProfileInDatabase = async (userId: string, email: string, firstName: string, lastName: string): Promise<UserProfile | null> => {
    try {
      console.log("📝 Creating profile in database for:", userId);
      
      const profileData = {
        id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        is_completed: false,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error("❌ Error inserting profile:", error);
        
        // If table doesn't exist, create it
        if (error.code === '42P01') {
          console.log("⚠️ Table doesn't exist, creating it...");
          // You should run the SQL to create the table
          return profileData as UserProfile;
        }
        
        // Try upsert as fallback
        const { data: upsertData, error: upsertError } = await supabase
          .from('user_profiles')
          .upsert([profileData], { onConflict: 'id' })
          .select()
          .single();

        if (upsertError) {
          console.error("❌ Upsert also failed:", upsertError);
          return profileData as UserProfile; // Return local profile
        }
        
        console.log("✅ Profile created via upsert:", upsertData);
        return upsertData as UserProfile;
      }
      
      console.log("✅ Profile created via insert:", data);
      return data as UserProfile;
      
    } catch (error) {
      console.error("❌ Error in createProfileInDatabase:", error);
      return null;
    }
  };

  // SIMPLIFIED: Fetch or create profile
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log("🔄 Fetching profile for user:", userId);

      const { data: profileData, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching profile:", error);
        
        // If permission denied or table doesn't exist, get user data and create local profile
        if (error.code === '42501' || error.code === '42P01') {
          console.log("🔒 RLS permission error or table missing, creating local profile");
          
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser) {
            const localProfile: UserProfile = {
              id: userId,
              email: authUser.email || "",
              first_name: authUser.user_metadata?.first_name || "User",
              last_name: authUser.user_metadata?.last_name || "",
              is_completed: false,
              preferences: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            
            console.log("📱 Created local profile:", localProfile);
            
            // Try to save to database (might fail due to RLS)
            try {
              await createProfileInDatabase(
                userId,
                localProfile.email,
                localProfile.first_name,
                localProfile.last_name
              );
            } catch (dbError) {
              console.log("⚠️ Could not save to database, keeping local only");
            }
            
            return localProfile;
          }
        }
        
        return null;
      }
      
      console.log("✅ Profile fetched successfully:", profileData);
      return profileData as UserProfile;
      
    } catch (error: any) {
      console.error("❌ Error in fetchProfile:", error);
      
      // Last resort: create basic profile
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        return {
          id: userId,
          email: authUser.email || "",
          first_name: authUser.user_metadata?.first_name || "User",
          last_name: authUser.user_metadata?.last_name || "",
          is_completed: false,
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as UserProfile;
      }
      
      return null;
    }
  };

  // Check and restore session
  const checkSession = async () => {
    try {
      setLoading(true);
      
      // First try to get current session
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        // Try to load saved session
        const savedSession = await loadSavedSession();
        if (savedSession) {
          setSession(savedSession.session);
          setUser(savedSession.session.user);
          setProfile(savedSession.profile);
        }
      } else if (currentSession?.user) {
        console.log('🔍 Current session found:', currentSession.user.id);
        
        setUser(currentSession.user);
        setSession(currentSession);
        
        // Save session
        await saveSession(currentSession.user, currentSession);
        
        // Fetch profile
        const userProfile = await fetchProfile(currentSession.user.id);
        if (userProfile) {
          setProfile(userProfile);
          await saveProfile(userProfile);
        }
      } else {
        // No session, try to load saved
        const savedSession = await loadSavedSession();
        if (savedSession) {
          setSession(savedSession.session);
          setUser(savedSession.session.user);
          setProfile(savedSession.profile);
        }
      }
    } catch (error) {
      console.error('❌ Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      await checkSession();

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;

          console.log('🔄 Auth state changed:', event, session?.user?.id);

          if (event === 'PASSWORD_RECOVERY') {
            console.log('🔐 PASSWORD_RECOVERY event detected');
            return;
          }

          if (session?.user) {
            console.log('✅ User authenticated:', session.user.id);
            setUser(session.user);
            setSession(session);
            
            // Save session
            await saveSession(session.user, session);
            
            // Fetch profile
            const userProfile = await fetchProfile(session.user.id);
            if (userProfile) {
              setProfile(userProfile);
              await saveProfile(userProfile);
            }
          } else {
            console.log('👋 User signed out');
            setUser(null);
            setProfile(null);
            setSession(null);
            await clearSession();
          }
          
          setLoading(false);
        }
      );

      return () => {
        console.log('🧹 AuthProvider: Cleaning up');
        mounted = false;
        subscription.unsubscribe();
      };
    };

    const cleanup = initializeAuth();
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(fn => fn && fn());
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
  try {
    setLoading(true);
    console.log("🔑 Attempting sign in with:", email);

    // Clear any reset session data
    await AsyncStorage.multiRemove([
      'has_valid_reset_session',
      'recovery_session_active',
      'reset_email'
    ]);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error("❌ Sign in error:", error);
      throw error;
    }

    console.log("✅ Sign in successful:", data.user?.id);

    if (data.user && data.session) {
      setUser(data.user);
      setSession(data.session);
      
      // Save session
      await saveSession(data.user, data.session);
      
      // Fetch profile after sign in
      const userProfile = await fetchProfile(data.user.id);
      if (userProfile) {
        setProfile(userProfile);
        await saveProfile(userProfile);
      }

      // Register for push notifications
      try {
        const pushToken = await fcmService.registerForPushNotificationsAsync();
        if (pushToken) {
          await fcmService.savePushTokenToDatabase(data.user.id, pushToken);
        }
      } catch (pushError) {
        console.error('❌ Push notification registration failed:', pushError);
      }

      // Send login notification
      try {
        const deviceInfo = `${Device.modelName || 'جهاز'} (${Platform.OS})`;
        await authNotificationService.sendLoginNotification(
          data.user.id,
          data.user.email || email,
          deviceInfo
        );
      } catch (notifError) {
        console.error('❌ Login notification failed:', notifError);
      }
    }

    return data;
  } catch (error: any) {
    console.error("❌ Sign in failed:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};

  // SIMPLIFIED signUp function
  const signUp = async (
    email: string,
    password: string,
    userData: {
      first_name: string;
      last_name: string;
    }
  ) => {
    try {
      setLoading(true);
      console.log("🚀 Attempting sign up with:", email);

      const cleanEmail = email.trim().toLowerCase();
      const cleanFirstName = userData.first_name.trim();
      const cleanLastName = userData.last_name.trim();

      // Step 1: Create auth user
      console.log("📝 Creating auth user...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            first_name: cleanFirstName,
            last_name: cleanLastName,
          }
        },
      });

      if (authError) {
        console.error("❌ Sign up error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("User creation failed");
      }

      console.log("✅ Auth user created:", authData.user.id);

      // Step 2: Create profile
      console.log("📝 Creating user profile...");
      let userProfile: UserProfile | null = null;
      
      try {
        userProfile = await createProfileInDatabase(
          authData.user.id,
          cleanEmail,
          cleanFirstName,
          cleanLastName
        );
        
        if (!userProfile) {
          // Create local profile if database fails
          userProfile = {
            id: authData.user.id,
            email: cleanEmail,
            first_name: cleanFirstName,
            last_name: cleanLastName,
            is_completed: false,
            preferences: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as UserProfile;
        }
      } catch (profileError) {
        console.error("❌ Profile creation error:", profileError);
        // Create local profile as fallback
        userProfile = {
          id: authData.user.id,
          email: cleanEmail,
          first_name: cleanFirstName,
          last_name: cleanLastName,
          is_completed: false,
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as UserProfile;
      }

      // Step 3: Auto sign in
      console.log("🔑 Attempting auto login...");
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInError) {
        console.error("❌ Auto login error:", signInError);
        
        Alert.alert(
          "تم إنشاء الحساب",
          "تم إنشاء حسابك بنجاح. يرجى تسجيل الدخول باستخدام بيانات الاعتماد الخاصة بك.",
          [{ text: "موافق", onPress: () => router.push('/(auth)/login') }]
        );
        return;
      }

      console.log("✅ Auto login successful");

      // Step 4: Set state
      if (signInData.user && signInData.session) {
        setUser(signInData.user);
        setSession(signInData.session);
        setProfile(userProfile);

        // Save session
        await saveSession(signInData.user, signInData.session);
        if (userProfile) {
          await saveProfile(userProfile);
        }

        console.log("🎉 Signup process completed!");
        router.replace('/(main)');
      }

    } catch (error: any) {
      console.error('❌ Signup error:', error);
      
      if (error.message?.includes('already registered')) {
        throw new Error("هذا البريد الإلكتروني مسجل بالفعل. يرجى محاولة تسجيل الدخول بدلاً من ذلك.");
      }
      
      throw new Error(error.message || "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear session data
      await clearSession();
      
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);
      
      router.replace('/(auth)/login');
    } catch (error: any) {
      console.error("❌ Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in");

    try {
      setLoading(true);

      // Try to update in database
      const { error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.warn("⚠️ Database update failed, updating local only:", error);
      }

      // Always update local state
      if (profile) {
        const updatedProfile = {
          ...profile,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        setProfile(updatedProfile);
        await saveProfile(updatedProfile);
      }
      
    } catch (error: any) {
      console.error("❌ Update profile error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await fetchProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
        await saveProfile(userProfile);
      }
    }
  };

  const value = {
    user,
    profile,
    loading,
    session,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}