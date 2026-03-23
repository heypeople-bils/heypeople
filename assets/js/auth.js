import { supabase } from "/assets/js/supabase.js";

// Se già loggato → vai direttamente all'app
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) location.replace("/app.html");
})();

// Domini email temporanei bloccati
const BLOCKED = [
  "tempmail","10min","10minutemail","yopmail",
  "mailinator","trashmail","dispostable","getnada",
  "moakt","sharklasers","fakeinbox","guerrillamail"
];

const isTempMail = (email) =>
  BLOCKED.some(k => email.toLowerCase().includes(k));

// LOGIN CON GOOGLE
window.loginWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Redirect diretto all’app per evitare schermo nero o problemi di cache
        redirectTo: window.location.origin + "/app.html"
      }
    });
    if (error) throw error;
  } catch (err) {
    alert("Errore login Google: " + err.message);
  }
};

// LOGIN VIA EMAIL (OTP passwordless)
window.loginWithEmailOtp = async () => {
  const email = (document.getElementById("auth-email")?.value || "").trim();

  if (!email) return alert("Inserisci una email.");
  if (isTempMail(email)) return alert("Email temporanea non permessa.");

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Dopo il click sul link → rientri direttamente nell'app
        emailRedirectTo: window.location.origin + "/app.html"
      }
    });
    if (error) throw error;
    alert("Controlla la tua email! Ti abbiamo inviato il link.");
  } catch (err) {
    alert("Errore login email: " + err.message);
  }
};

// Entra manualmente nell’app
window.goToApp = () => location.replace("/app.html");

// Se lo stato diventa "loggato" → vai all’app
supabase.auth.onAuthStateChange((_ev, session) => {
  if (session) location.replace("/app.html");
});
