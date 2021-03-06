import axios from "axios";

async function getData() {
  const response = await axios.get("http://localhost:8888/");

  return response.data.shortenHistory;
}

export default getData;
