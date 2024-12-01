import { config } from "dotenv"
config();

export default {
    BIOMETRICOusername: process.env.BIOMETRICO_USERNAME || "",
    BIOMETRICOpassword: process.env.BIOMETRICO_PASSWORD || "",
    BIOMETRICOpuerto: process.env.BIOMETRICO_PUERTO || "",
};