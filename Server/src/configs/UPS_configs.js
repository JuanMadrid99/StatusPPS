import { config } from "dotenv"

config();

export default {
    UPSusername: process.env.UPS_USERNAME || "",
    UPSpassword: process.env.UPS_PASSWORD || "",
    UPScommand: process.env.UPS_COMMAND || ""
};