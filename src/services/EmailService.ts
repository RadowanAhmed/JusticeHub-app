// services/EmailService.ts - UPDATED VERSION
import { supabase } from '@/lib/supabase';

export class EmailService {
  // Generate 6-digit code
  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Check if email exists using Supabase auth
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const cleanEmail = email.toLowerCase().trim();
      console.log(`🔍 Checking if email exists: ${cleanEmail}`);
      
      // Use Supabase's admin API (requires service role key)
      // Note: For client-side, use a different approach
      
      // Fallback: Try to send reset email - Supabase will validate internally
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${process.env.EXPO_PUBLIC_APP_SCHEME}://reset-password/`,
      });
      
      if (error) {
        if (error.message?.includes('user not found') || 
            error.status === 404 ||
            error.message?.includes('User not found')) {
          console.log(`❌ Email not found: ${cleanEmail}`);
          return false;
        }
        // Other errors (rate limiting, etc.) - assume exists
        console.log(`⚠️ Error but proceeding: ${error.message}`);
        return true;
      }
      
      console.log(`✅ Email exists: ${cleanEmail}`);
      return true;
      
    } catch (error: any) {
      console.error('Error checking email:', error);
      // Assume exists to not block legitimate users
      return true;
    }
  }

  // Simplified check for password reset
  static async checkEmailExistsSimple(email: string): Promise<boolean> {
    return this.checkEmailExists(email);
  }

  // Store reset code in database
  static async storeResetCode(email: string, code: string): Promise<boolean> {
    try {
      const cleanEmail = email.toLowerCase().trim();
      
      console.log(`💾 Storing 6-digit reset code for ${cleanEmail}: ${code}`);
      
      // Ensure code is 6 digits
      if (code.length !== 6) {
        console.error(`❌ Code must be 6 digits, got: ${code}`);
        return false;
      }
      
      // Set expiration (10 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
      
      const resetCodeData = {
        email: cleanEmail,
        code,
        expires_at: expiresAt.toISOString(),
        used: false,
        created_at: new Date().toISOString()
      };

      // Delete any existing unused codes for this email
      await supabase
        .from('password_reset_codes')
        .delete()
        .eq('email', cleanEmail)
        .eq('used', false);

      // Store the new code
      const { error } = await supabase
        .from('password_reset_codes')
        .insert([resetCodeData]);

      if (error) {
        console.error('Error storing reset code:', error);
        return false;
      }

      console.log('✅ Reset code stored successfully');
      return true;
    } catch (error) {
      console.error('Error in storeResetCode:', error);
      return false;
    }
  }

  // Verify reset code
  static async verifyResetCode(email: string, code: string): Promise<boolean> {
    try {
      const cleanEmail = email.toLowerCase().trim();
      
      if (code.length !== 6) {
        console.error(`❌ Code must be 6 digits, got: ${code}`);
        return false;
      }
      
      console.log(`🔍 Verifying 6-digit code ${code} for ${cleanEmail}`);
      
      // Check for valid, unused, non-expired code
      const { data, error } = await supabase
        .from('password_reset_codes')
        .select('*')
        .eq('email', cleanEmail)
        .eq('code', code)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.log('❌ No valid code found or error:', error?.message);
        return false;
      }

      console.log('✅ Code verified successfully');
      
      // Mark code as used
      await supabase
        .from('password_reset_codes')
        .update({ 
          used: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      return true;
    } catch (error) {
      console.error('Error in verifyResetCode:', error);
      return false;
    }
  }

  // Send password reset email using Supabase built-in
  static async sendPasswordResetEmail(email: string, code: string): Promise<boolean> {
    try {
      const cleanEmail = email.toLowerCase().trim();
      
      console.log(`📧 Sending password reset to ${cleanEmail} with code: ${code}`);
      
      // Store code first
      const stored = await this.storeResetCode(cleanEmail, code);
      if (!stored) {
        return false;
      }
      
      // Send reset email using Supabase's built-in system
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${process.env.EXPO_PUBLIC_APP_SCHEME}://reset-password/`,
      });
      
      if (error) {
        console.error('Supabase reset email error:', error);
        return false;
      }
      
      console.log('✅ Password reset email sent via Supabase');
      return true;
      
    } catch (error) {
      console.error('Error in sendPasswordResetEmail:', error);
      return false;
    }
  }

  // Send verification code email (using Supabase OTP)
  static async sendVerificationCodeEmail(email: string, code: string): Promise<boolean> {
    try {
      const cleanEmail = email.toLowerCase().trim();
      
      console.log(`📧 Sending 6-digit code to ${cleanEmail}: ${code}`);
      
      if (__DEV__) {
        console.log(`📱 [DEV] Email would be sent to: ${cleanEmail}`);
        console.log(`📱 [DEV] 6-digit code: ${code}`);
        
        // In development, we'll use Supabase OTP for testing
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: `${process.env.EXPO_PUBLIC_APP_SCHEME}://auth/callback`,
          },
        });
        
        if (error) {
          console.error('DEV: Supabase OTP error:', error);
          // Still return true for development
          return true;
        }
        
        return true;
      }
      
      // Store the code in our database
      const stored = await this.storeResetCode(cleanEmail, code);
      
      // Use Supabase's email service with custom template
      // Note: You need to set up the email template in Supabase Dashboard
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${process.env.EXPO_PUBLIC_APP_SCHEME}://auth/reset-password?code=${code}`,
      });
      
      if (error) {
        console.error('Supabase email error:', error);
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }
}