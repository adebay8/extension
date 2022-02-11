import express from "express";
import axios from "axios";
const router = express.Router();

const token = "";
const request = {};
const getSellingPlans = {};

router.post("/selling-groups", (req, res) => {
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

router.get("/selling-groups", (req, res) => {
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

router.patch("/selling-groups", (req, res) => {});

router.post("/selling-groups/products/:id", (req, res) => {});

export default router;
