import { LINKS } from "../../constants/links";

export default async function handler(req, res) {
  const projectId = process.env.BLOCKFROST_PROJECT_ID;
  const { address } = req.query;
  const url = LINKS.BLOCKFROST_ADDRESS + address + "/total";

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      project_id: projectId,
    },
  });

  const data = await response.json();

  res.status(200).json({ value: data });
}
