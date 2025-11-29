import express from "express";
import userRouter from "./routes/user.route";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { UserSchema } from "./schemas/user.schemas";
import zodToJsonSchema from "zod-to-json-schema";

const app = express();

app.use(express.json());

app.use("/users", userRouter);

// --- 2. Chuyển đổi Zod Schema thành OpenAPI Schema (JSON Schema) ---
const UserOpenAPISchema = zodToJsonSchema(UserSchema, { $refStrategy: 'none' });

// --- 3. config Swagger JSDoc ---
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Tài liệu Người dùng & Bài viết',
      version: '1.0.0',
      description: 'Ví dụ sử dụng Swagger/OpenAPI với Zod Schemas.',
    },
    servers: [
      {
        url: `http://localhost:3000`,
        description: 'Máy chủ Phát triển',
      },
    ],
    // TẠO KHU VỰC COMPONENTS/SCHEMAS TỪ ZOD
    components: {
        schemas: {
            User: UserOpenAPISchema, // Lấy schema đã chuyển đổi
        }
    }
  },
  // Đường dẫn đến các file chứa comments JSDoc. 
  // Bạn có thể chỉ định file này hoặc file chứa route của bạn.
  apis: ['./src/routes/*.ts'], 
};

// --- 4. Swagger Setup ---
const swaggerSpec = swaggerJsdoc(options);


// --- 5. Config Middleware Swagger UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
