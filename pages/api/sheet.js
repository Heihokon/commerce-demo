import { google } from "googleapis";
import keys from "../../key";

export default function handler(req, res) {
    try {
        const client = new google.auth.JWT(
            keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
        );

        client.authorize(async function (err, tokens) {
            if (err) {
                return res.status(400).send(JSON.stringify({ error: true }));
            }

            const gsapi = google.sheets({ version: 'v4', auth: client });

            //CUSTOMIZATION FROM HERE
            const opt = {
                spreadsheetId: '199U4CchgWlJXgOTWvteY2RHCYuHhjY-n8E5E1bhCDUo',
                range: 'quickstartdemo-valerian1!A:Z'
            };
            let data = await gsapi.spreadsheets.values.get(opt);
            return res.status(400).send(JSON.stringify({ error: false, data: data.data.values.slice(1).map(([productId, name, brand, price, oldprice, category, productUrl, smallImage, availability, quantity, size, google_product_category]) => ({ productId, name, brand, price, oldprice, category, productUrl, smallImage, availability, quantity, size, google_product_category })) }));
        });
    } catch (e) {
        return res.status(400).send(JSON.stringify({ error: true, message: e.message }));
    }
}