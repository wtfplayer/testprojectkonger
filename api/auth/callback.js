const CLIENT_ID = "1491564164160819250";
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET; // Add this in Vercel Environment Variables!

export default async function handler(req, res) {
  const { code, state } = req.query;
  const storedState = req.cookies?.oauth_state;

  if (!code) return res.status(400).send("No code received");
  if (state !== storedState) return res.status(400).send("Invalid state");

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
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

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(400).json({ error: tokenData });
    }

    // Redirect back to home with token (short-lived, safer than before)
    res.redirect(`/?access_token=${tokenData.access_token}`);

  } catch (err) {
    console.error(err);
    res.status(500).send("Authentication failed");
  }
}
