export default async function handler(req, res) {
    try {
      const response = await fetch('https://api.lo-fi.me/v1/tracks/random');
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching from lo-fi API:', error);
      res.status(500).json({ error: 'Failed to fetch lo-fi track' });
    }
  }