async function refreshHealth() {
  const el = document.getElementById('health');
  el.textContent = 'Chargement...';
  try {
    const res = await fetch('/health');
    const json = await res.json();
    el.textContent = JSON.stringify(json, null, 2);
  } catch (err) {
    el.textContent = 'Erreur: ' + err.message;
  }
}

document.getElementById('refresh').addEventListener('click', refreshHealth);

// migrations button — note: this requires a server-side endpoint to actually trigger migrations
document.getElementById('migrate').addEventListener('click', async () => {
  const out = document.getElementById('migrate-result');
  out.textContent = 'Demande envoyée...';
  try {
    const res = await fetch('/internal/run-migrations', { method: 'POST' });
    const txt = await res.text();
    out.textContent = 'Résultat: ' + txt;
  } catch (err) {
    out.textContent = 'Erreur: ' + err.message;
  }
});

// initial load
refreshHealth();
