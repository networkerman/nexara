import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id?: string;
  user_id: string;
  full_name: string;
  company_name: string;
  company_domain: string;
  number_of_employees: string;
  organization_size: string;
  user_role: string;
  created_at?: string;
  updated_at?: string;
}

export const userProfileService = {
  // Create a new user profile
  async createProfile(profile: Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>, userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        ...profile
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    return data;
  },

  // Get user profile by user ID
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    return data;
  },

  // Delete user profile
  async deleteProfile(userId: string) {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  },

  // Check if user has completed onboarding
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    const profile = await this.getProfile(userId);
    return !!profile;
  }
};
