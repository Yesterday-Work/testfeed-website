exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { urls } = JSON.parse(event.body);
    if (!urls || !Array.isArray(urls)) {
      return { statusCode: 400, body: 'urls array required' };
    }

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'testfeed.ai',
        key: 'a7f3c2e1-9b4d-4f8a-b6e2-1d5c8a3f7e9b',
        keyLocation: 'https://testfeed.ai/a7f3c2e1-9b4d-4f8a-b6e2-1d5c8a3f7e9b.txt',
        urlList: urls,
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ submitted: urls.length, indexnowStatus: res.status }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
