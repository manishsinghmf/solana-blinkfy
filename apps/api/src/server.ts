import { createApp } from "./app.js";
import { getEnv } from "./config/env.js";

const env = getEnv();
const app = createApp({ env });

app.listen(env.port, () => {
  console.log(`API listening on ${env.apiOrigin}`);
});
