const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { student_name, student_class, score, total, answers } = req.body;
    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO tvi_results (student_name, student_class, score, total, answers, submitted_at)
      VALUES (${student_name}, ${student_class}, ${score}, ${total}, ${JSON.stringify(answers)}, NOW())
    `;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
