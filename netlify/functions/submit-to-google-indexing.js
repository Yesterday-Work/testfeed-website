const { GoogleAuth } = require('google-auth-library');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { urls } = JSON.parse(event.body);
    if (!urls || !Array.isArray(urls)) {
      return { statusCode: 400, body: 'urls array required' };
    }

    const credentials = JSON.parse(process.env.GOOGLE_INDEXING_CREDENTIALS);
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const results = await Promise.all(
      urls.map(async (url) => {
        const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, type: 'URL_UPDATED' }),
        });
        const data = await res.json();
        return { url, status: res.status, response: data };
      })
    );

    const successes = results.filter(r => r.status === 200).length;
    const failures = results.filter(r => r.status !== 200);

    return {
      statusCode: 200,
      body: JSON.stringify({
        submitted: successes,
        failed: failures.length,
        failures,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
