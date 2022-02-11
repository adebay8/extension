import express, { Request, Response } from "express";
import Shopify, { ApiVersion, AuthQuery } from "@shopify/shopify-api";
import dotenv from "dotenv";
import router from "./routes/selling-groups";
dotenv.config();

const app = express();

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env;

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST.replace(/https:\/\//, ""),
  IS_EMBEDDED_APP: true,
  API_VERSION: ApiVersion.October20, // all supported versions are available, as well as "unstable" and "unversioned"
});

const ACTIVE_SHOPIFY_SHOPS: { [key: string]: string | undefined } = {};

app.use((req: Request, res: Response, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "content-type, accepts, authorization, context"
  );
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req: Request, res: Response) => {
  // This shop hasn't been seen yet, go through OAuth to create a session
  if (ACTIVE_SHOPIFY_SHOPS[SHOP] === undefined) {
    // not logged in, redirect to login
    res.redirect(`/login`);
  } else {
    res.send("Hello world!");
    // Load your app skeleton page with App Bridge, and do something amazing!
    res.end();
  }
});

app.get("/login", async (req: Request, res: Response) => {
  let authRoute = await Shopify.Auth.beginAuth(
    req,
    res,
    SHOP,
    "/auth/callback",
    false
  );
  return res.redirect(authRoute);
});

// app.get("/auth", (req: Request, res: Response) => {
//   // console.log(res.header().getHeaders());
//   return res.redirect(
//     `https://${process.env.SHOP_NAME}.myshopify.com/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SCOPES}&redirect_uri=${process.env.HOST}/callback&state=stringstring&grant_options[]=value`
//   );
// });

app.get("/auth/callback", async (req, res) => {
  try {
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery
    ); // req.query must be cast to unkown and then AuthQuery in order to be accepted
    ACTIVE_SHOPIFY_SHOPS[SHOP] = session.scope;
    console.log(session.accessToken);
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }
  return res.redirect(`/?host=${req.query.host}&shop=${req.query.shop}`); // wherever you want your user to end up after OAuth completes
});

app.use("/selling-groups", router);

app.listen(process.env.PORT || 9091, () => {
  console.log("server running");
});
