import { createClient } from '../supabase/client'

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    const supabase = createClient()
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        // In local development, you might not have email verification properly set up yet.
        // We set emailRedirectTo to bring them back to the app if they do verify.
        emailRedirectTo: `${window.location.origin}/workspaces/add`,
      },
    })
  },

  async signIn(email: string, password: string) {
    const supabase = createClient()
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  async signOut() {
    const supabase = createClient()
    return await supabase.auth.signOut()
  },

  async getUser() {
    const supabase = createClient()
    return await supabase.auth.getUser()
  },
}
