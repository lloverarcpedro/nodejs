"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = __importDefault(require("./routes/v1/index"));
dotenv_1.default.config(); //Enable environment variables read.
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false })); //Enable urlencode body
app.use(body_parser_1.default.json()); //Enable json body
index_1.default(app);
const PORT = process.env.PORT || 4000;
mongoose_1.default
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch(error => {
    console.log('Connection Error', error);
});
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
