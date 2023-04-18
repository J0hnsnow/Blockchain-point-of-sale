export default async function handler(req, res) {
    const { address } = req.query;
    const url = `https://api.koios.rest/api/v0/address_info`;
  
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "_addresses": [
            address
          ],
      },
    });
  
    const data = await response.json();
  
    res.status(200).json({ value: data });
  }
  