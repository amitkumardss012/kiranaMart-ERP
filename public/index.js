"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 4000;
const startSever = () => __awaiter(void 0, void 0, void 0, function* () {
    app_1.default.listen({ port: Number(PORT), host: '0.0.0.0' }, (error, address) => {
        if (error) {
            console.log(error);
            app_1.default.log.error(error);
            process.exit(1);
        }
        else {
            console.log(`
        🖥️  SERVER STARTED 🚀  
        ┌───────────────────┐
        │   [■■■■■■■■■■■]   │
        │   [■■■■■■■■■■■]   │
        │   [■■■■■■■■■■■]   │
        │   [■■■■■■■■■■■]   │ 
        │   [■■■■■■■■■■■]   │
        └───────────────────┘
        http://localhost:${PORT}
      `);
        }
    });
});
startSever();
