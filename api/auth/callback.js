const CLIENT_ID = "1491564164160819250";
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;   // Must be set in Vercel

export default async function handler(req, res) {
  const { code, state } = req.query;

  // Get state from cookie
  const cookies = req.cookies || {};
  const storedState = cookies.oauth_state;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  if (!storedState || state !== storedState) {
    return res.status(400).send("Invalid state - possible security issue");
  }

  if (!CLIENT_SECRET) {
    console.error("DISCORD_CLIENT_SECRET is not set in environment variables");
    return res.status(500).send("Server configuration error");
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: "https://testprojectkonger.vercel.app/api/auth/callback",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);
      return res.redirect('/?error=token_failed');
    }

    // Redirect back to homepage with the access token
    res.redirect(`/?access_token=${tokenData.access_token}`);

  } catch (error) {
    console.error("Callback error:", error);
    res.redirect('/?error=server_error');
  }
}
