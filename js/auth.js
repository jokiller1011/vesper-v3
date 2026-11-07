(async function initAuth() {
  const authScreen = document.getElementById('auth-screen');
  const app = document.getElementById('app');
  const loading = document.getElementById('loading-overlay');

  // 1. Show the loading screen for 2 seconds
  await new Promise(res => setTimeout(res, 2000));

  // 2. Check for active session
  const { data: { session } } = await supabase.auth.getSession();

  loading.classList.add('hidden');
  if (session) {
    authScreen.classList.add('hidden');
    app.classList.remove('hidden');
  } else {
    authScreen.classList.remove('hidden');
    app.classList.add('hidden');
  }

  // Handle OAuth redirects seamlessly
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      window.location.reload();
    }
  });

  // Email/password auth
  document.getElementById('email-auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');
    const submitBtn = document.getElementById('auth-submit');

    submitBtn.textContent = 'Please wait...';
    errorEl.textContent = '';
    errorEl.style.color = '#ff5555'; // Default red

    // Try to sign in
    let { error } = await supabase.auth.signInWithPassword({ email, password });
    
    // If login fails, try signing up
    if (error && error.message.includes('Invalid login credentials')) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      
      if (signUpError) {
        errorEl.textContent = signUpError.message;
        submitBtn.textContent = 'Sign In / Sign Up';
        return;
      }
      
      // If signup works but no session, email confirmation is required
      if (signUpData.user && !signUpData.session) {
        errorEl.style.color = '#00ff00'; // Green for success
        errorEl.textContent = 'Account created! Please check your email to confirm.';
        submitBtn.textContent = 'Sign In / Sign Up';
        return;
      }
    } else if (error) {
      errorEl.textContent = error.message;
      submitBtn.textContent = 'Sign In / Sign Up';
      return;
    }
    
    window.location.reload();
  });

  // GitHub OAuth
  document.getElementById('github-auth').addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin } // Redirects to base URL
    });
    if (error) document.getElementById('auth-error').textContent = error.message;
  });

  // Sign out
  const signOutBtn = document.getElementById('sign-out');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.reload();
    });
  }
})();
