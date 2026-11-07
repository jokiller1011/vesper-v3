(async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  const authScreen = document.getElementById('auth-screen');
  const app = document.getElementById('app');
  const loading = document.getElementById('loading-overlay');

  if (session) {
    authScreen.classList.add('hidden');
    app.classList.remove('hidden');
    loading.classList.add('hidden');
  } else {
    loading.classList.add('hidden');
    authScreen.classList.remove('hidden');
    app.classList.add('hidden');
  }

  // Email/password auth
  document.getElementById('email-auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');

    // Try sign in first, fallback to sign up
    let { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error && error.message.includes('Invalid login credentials')) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) { errorEl.textContent = signUpError.message; return; }
    } else if (error) {
      errorEl.textContent = error.message;
      return;
    }
    window.location.reload();
  });

  // GitHub OAuth
  document.getElementById('github-auth').addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
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
