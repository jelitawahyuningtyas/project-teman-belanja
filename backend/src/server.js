import app from "./app.js";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Backend berjalan di http://localhost:${PORT}`
  );
});