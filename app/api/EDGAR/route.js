import fetch from 'node-fetch';
import cheerio from 'cheerio';

export async function POST(req, res) {
    let request_data;
    try {
        request_data = await req.json();
    } catch (error) {
        console.error('Error parsing request data:', error);
        return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
    }

    const ticker = request_data.ticker;
    if (!ticker) {
        return new Response(JSON.stringify({ error: 'Ticker symbol is required.' }), { status: 404 });
    }

    try {
        const searchUrl = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${encodeURIComponent(ticker)}&owner=exclude&type=10-K`;
        const searchResponse = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Kali Capital - Contact: connor@kalicapital.io',
            },
        });
        const htmlSearch = await searchResponse.text();
        const $search = cheerio.load(htmlSearch);
        const cikText = $search('div.companyInfo').text();
        const match = cikText.match(/CIK#: (\d+)/);

        if (!match) {
            return new Response(JSON.stringify({ error: 'CIK not found.' }), { status: 404 });
        }

        const cik = match[1];
        const filingsUrl = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=10-K&dateb=&owner=exclude&count=10`;
        const filingsResponse = await fetch(filingsUrl, {
            headers: {
                'User-Agent': 'Kali Capital - Contact: connor@kalicapital.io',
            },
        });
        const htmlFilings = await filingsResponse.text();
        const $filings = cheerio.load(htmlFilings);
        const filings = [];

        $filings('tr').each((i, el) => {
            const documentLink = $filings(el).find('td:nth-child(2) a');
            if (documentLink.length > 0) {
                const filing = documentLink.text().trim();
                const dateFiled = $filings(el).find('td:nth-child(4)').text().trim();
                const documentHref = documentLink.attr('href');
                if (filing && documentHref) {
                    filings.push({ filing, dateFiled, documentHref: `https://www.sec.gov${documentHref}` });
                }
            }
        });

        if (filings.length > 0) {
            const mostRecentFilingIndexPageUrl = filings[0].documentHref;
            const documentResponse = await fetch(mostRecentFilingIndexPageUrl, {
                headers: {
                    'User-Agent': 'Kali Capital - Contact: connor@kalicapital.io',
                },
            });
            const documentHtml = await documentResponse.text();
            const $document = cheerio.load(documentHtml);
        
            let documentUrl;
            // Look for the document link within the fetched HTML
            $document('table.tableFile').find('tr').each((i, el) => {
                const fileType = $document(el).find('td:nth-child(4)').text().trim();
                if (fileType === '10-K') {
                    const docLink = $document(el).find('td:nth-child(3) a').attr('href');
                    if (docLink) {
                        documentUrl = `https://www.sec.gov${docLink}`;
                        return false; // Break the loop once we find the first 10-K link
                    }
                }
            });
        
            if (documentUrl) {
                // If we've found the 10-K document link, return it
                // console.log('10-K Document URL: ', documentUrl);

                // Assuming documentUrl is the URL of the HTML document you've fetched
                const documentResponse = await fetch(documentUrl, {
                    headers: {
                        'User-Agent': 'Kali Capital - Contact: connor@kalicapital.io',
                    },
                });
                const documentHtml = await documentResponse.text();
                console.log('documentHtml', documentHtml)
                const $document = cheerio.load(documentHtml);

                let documentText = '';
                $document('p, h1, h2, h3, h4, h5, h6').each((i, el) => {
                    documentText += $document(el).text() + '\n\n'; // Concatenate text, adding some spacing for readability
                });

                console.log('documentText: ', documentText)
                return new Response(JSON.stringify({ documentText }), { status: 200 });

            } else {
                // No 10-K document link found within the index page
                console.log('No 10-K document link found.');
                return new Response(JSON.stringify({ error: 'No 10-K filings found.' }), { status: 400 });
            }
        } else {
            // No filings were found
            console.log('No 10-K filings were found.');
            res.status(404).json({ error: 'No 10-K filings found.' });
        }    } catch (error) {
        console.error('Error fetching CIK or 10-K filings:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch CIK or 10-K filings.' }), { status: 500 });
    }
}
