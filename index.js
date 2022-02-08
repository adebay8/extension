const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { token, request, getSellingPlans } = require("./sample.");
const jwt = require("jsonwebtoken");
const Shopify = require("@shopify/shopify-api");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use((req, res, next) => {
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

app.get("/auth", (req, res) => {
  console.log(res.header().getHeaders());
  return res.redirect(
    `https://${process.env.SHOP_NAME}.myshopify.com/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SCOPES}&redirect_uri=${process.env.HOST}/callback&state=stringstring&grant_options[]=value`
  );
});

app.get("/callback", (req, res) => {});

app.post("/selling-groups", (req, res) => {
  //   console.log("headers", res.header().getHeaders());

  // add middleware to verify session token sent from the extension app

  // generate token you will use to send request to the shopify api using the oauth flow
  // https://shopify.dev/apps/auth/oauth

  axios({
    url: "https://adebayo-dev-store.myshopify.com/admin/api/2021-01/graphql.json",
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": token,
    },
    data: JSON.stringify(request),
  })
    .then((result) => {
      return res.status(200).json({
        data: result.data,
      });
    })
    .catch((error) => console.log(error.response.data));

  res.status(201).json({
    message: "Selling plan created successful",
  });
});

app.get("/selling-groups", (req, res) => {
  axios({
    url: "https://adebayo-dev-store.myshopify.com/admin/api/2021-01/graphql.json",
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": token,
    },
    data: JSON.stringify(getSellingPlans),
  })
    .then((result) => {
      return res.status(200).json({
        data: result.data,
      });
    })
    .catch((error) => {
      return res.status(error.response.status).json({
        errors: error.response.data.errors,
      });
    });
});

app.patch("/selling-groups", (req, res) => {});

app.post("/selling-groups/products/:id", (req, res) => {});

app.listen(9091, () => {
  console.log("server running");
});
