const axios = require('axios');

module.exports = async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        const documentUrl = extractDocumentUrl(response.data);

        if (documentUrl) {
            const documentResponse = await axios.get(documentUrl, { responseType: 'arraybuffer' });
            res.set('Content-Disposition', 'attachment; filename=document.pdf');
            res.send(documentResponse.data);
        } else {
            res.status(404).send('Document URL not found');
        }
    } catch (error) {
        res.status(500).send('Failed to download document: ' + error.message);
    }
};

function extractDocumentUrl(html) {
    const regex = /bulkDownloadUrl&quot;:&quot;(.*?)&quot;/;
    const matches = html.match(regex);
    return matches ? matches[1].replace(/\\u0026/g, '&') : null;
}
