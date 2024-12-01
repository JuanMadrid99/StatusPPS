import { config } from "dotenv"

config();

export default {
    ILOusername: process.env.ILO_USERNAME || "",
    ILOpassword: process.env.ILO_PASSWORD || "",
    ILOcommand: process.env.ILO_COMMAND || ""
};