import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import shortUrlRoutes from "./routes/shortUrls";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());


// Mount short URL APIs
app.use("/", shortUrlRoutes);



// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
