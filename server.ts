import app from "./app";
import connectToDatabase from "./utils/connectToDatabase";

const port = process.env.PORT || 8080;

connectToDatabase("kodowanie");

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
