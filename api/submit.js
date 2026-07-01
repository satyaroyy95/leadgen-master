export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/production_leads`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(req.body)
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            const errorText = await response.text();
            return res.status(response.status).json({ error: 'Database rejected submission', details: errorText });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}