const keyData = {
  "2026-04-01": "A9F3K2M8XQ", "2026-04-02": "P1L6Z8B0RC", "2026-04-03": "G4H7T9Y2VE",
  "2026-04-04": "M3X5C8W1QP", "2026-04-05": "D6R2F9L7SZ", "2026-04-06": "V0N3K5A8TJ",
  "2026-04-07": "B9C1M4X6PG", "2026-04-08": "H2Q7Z5R0LW", "2026-04-09": "J8V3T6S1EN",
  "2026-04-10": "K5F1D9B7QA", "2026-04-11": "L6M2C3X8RT", "2026-04-12": "N1P4V9G5SZ",
  "2026-04-13": "R2J8F3L6WB", "2026-04-14": "S7H0C1T5QP", "2026-04-15": "T4K9M6X2RE",
  "2026-04-16": "U3B5V8L0QN", "2026-04-17": "W6D1P7F4ZA", "2026-04-18": "X9R2H5T8YC",
  "2026-04-19": "Y0M3K6C1PL", "2026-04-20": "Z7J8F2L5QR", "2026-04-21": "A2T9V4G7XS",
  "2026-04-22": "B5C1K8M3QP", "2026-04-23": "C6H4R0F9LW", "2026-04-24": "D3M7T2S6EN",
  "2026-04-25": "E8P5K1X4RA", "2026-04-26": "F0J3C9V6QZ", "2026-04-27": "G7L2M5T8YS",
  "2026-04-28": "H1K9B4F3QP", "2026-04-29": "I5D2V7L0RE", "2026-04-30": "J6M3X1C8ZN",
  "2026-05-01": "K9F0R6T5WP", "2026-05-02": "L4H2M3X7QA", "2026-05-03": "M1P8V9G2SZ",
  "2026-05-04": "N7J0F4L6WB", "2026-05-05": "O3C5T1Q8RP", "2026-05-06": "P8K2M7X4RE",
  "2026-05-07": "Q0B6V1L9QN", "2026-05-08": "R5D3P8F2ZA", "2026-05-09": "S9R1H6T5YC",
  "2026-05-10": "T4M7K0C3PL", "2026-05-11": "U8J2F9L1QR", "2026-05-12": "V3T5V4G8XS",
  "2026-05-13": "W6C1K7M2QP", "2026-05-14": "X2H4R8F0LW", "2026-05-15": "Y9M1T5S3EN",
  "2026-05-16": "Z5P3K6X7RA", "2026-05-17": "A0J8C2V4QZ", "2026-05-18": "B7L5M1T9YS",
  "2026-05-19": "C3K9B6F0QP", "2026-05-20": "D6D1V7L2RE", "2026-05-21": "E9M4X3C8ZN",
  "2026-05-22": "F2F5R1T6WP", "2026-05-23": "G8H3M2X9QA", "2026-05-24": "H1P7V0G5SZ",
  "2026-05-25": "I6J4F8L3WB", "2026-05-26": "J0C2T5Q7RP", "2026-05-27": "K5K8M1X6RE",
  "2026-05-28": "L3B9V4L0QN", "2026-05-29": "M7D1P3F8ZA", "2026-05-30": "N2R6H9T5YC",
  "2026-05-31": "O8M0K7C2PL"
};

const SERVER_ID = "1491567555259928598";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { discordToken } = req.body;
  if (!discordToken) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${discordToken}`,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ success: false, message: "Invalid Discord token" });
    }

    const guilds = await response.json();
    const isMember = guilds.some(guild => guild.id === SERVER_ID);

    if (!isMember) {
      return res.status(403).json({ success: false, message: "You must join the Discord server to access keys" });
    }

    // Get today's key based on the SERVER's time (UTC) — but we'll let frontend decide the date
    // Actually, to make it truly local, we now send the desired date from frontend
    // For security, we still validate membership here

    return res.status(200).json({ 
      success: true, 
      message: "Ready for local date" 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
