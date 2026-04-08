export default function handler(req, res) {
  const CLIENT_ID = "1491564164160819250";
  const REDIRECT_URI = "https://testprojectkonger.vercel.app/api/auth/callback";

  // Generate random state for CSRF protection
  const state = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);

  const authUrl = `https://discord.com/oauth2/authorize?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=identify%20guilds` +
    `&state=${state}`;

  // Store state in a cookie (simple protection)
  res.setHeader('Set-Cookie', `oauth_state=${state}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax`);

  res.redirect(authUrl);
}
