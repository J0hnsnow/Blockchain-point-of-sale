import { LINKS } from "../../constants/links";

export default async function handler(req, res) {
  const url = LINKS.COINMARKETCAP_ADA_USD_PAIR

  const response = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
    },
  });

  const data = await response.json();
  const adaPrice = data.data.ADA.quote.USD.price;

  res.status(200).json({ value: adaPrice });
}
