// Contact Studio deploy settings. Optional: keep this file next to index.html (the build writes it once and
// never overwrites it, so your edits stay). See README.md, "Google Cloud Storage".
//
// googleClientId: the OAuth client ID ("Web application", ends in .apps.googleusercontent.com) that turns on
//   "Sign in with Google" for private Google Cloud Storage buckets. It is public, not a secret: it identifies
//   this app, and grants nothing by itself (each bucket's permissions decide what a signed-in account may read).
//   It works only on the addresses listed as "Authorized JavaScript origins" for that client (https://…, or
//   http://localhost:PORT for testing; never a file:// page). null = no sign-in button; a pasted access token
//   still works.
window.CONTACT_STUDIO_CONFIG = {
  googleClientId: '919472795375-rc3huriaiqk6uhdp8id5e8qdlpiefhg0.apps.googleusercontent.com',
};
