"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const shopify_api_1 = __importStar(require("@shopify/shopify-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const selling_groups_1 = __importDefault(require("./routes/selling-groups"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env;
shopify_api_1.default.Context.initialize({
    API_KEY,
    API_SECRET_KEY,
    SCOPES: [SCOPES],
    HOST_NAME: HOST.replace(/https:\/\//, ""),
    IS_EMBEDDED_APP: true,
    API_VERSION: shopify_api_1.ApiVersion.October20, // all supported versions are available, as well as "unstable" and "unversioned"
});
const ACTIVE_SHOPIFY_SHOPS = {};
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type, accepts, authorization, context");
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // This shop hasn't been seen yet, go through OAuth to create a session
    console.log(req);
    if (ACTIVE_SHOPIFY_SHOPS[SHOP] === undefined) {
        // not logged in, redirect to login
        res.redirect(`/login`);
    }
    else {
        res.send("Hello world!");
        // Load your app skeleton page with App Bridge, and do something amazing!
        res.end();
    }
}));
app.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let authRoute = yield shopify_api_1.default.Auth.beginAuth(req, res, SHOP, "/auth/callback", false);
    return res.redirect(authRoute);
}));
// app.get("/auth", (req: Request, res: Response) => {
//   // console.log(res.header().getHeaders());
//   return res.redirect(
//     `https://${process.env.SHOP_NAME}.myshopify.com/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SCOPES}&redirect_uri=${process.env.HOST}/callback&state=stringstring&grant_options[]=value`
//   );
// });
app.get("/auth/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield shopify_api_1.default.Auth.validateAuthCallback(req, res, req.query); // req.query must be cast to unkown and then AuthQuery in order to be accepted
        ACTIVE_SHOPIFY_SHOPS[SHOP] = session.scope;
        console.log(session.accessToken);
    }
    catch (error) {
        console.error(error); // in practice these should be handled more gracefully
    }
    return res.redirect(`/?host=${req.query.host}&shop=${req.query.shop}`); // wherever you want your user to end up after OAuth completes
}));
app.use("/selling-groups", selling_groups_1.default);
app.listen(process.env.PORT || 9091, () => {
    console.log("server running");
});
//# sourceMappingURL=index.js.map