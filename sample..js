const token = "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";
const request = {
  query: `
        mutation {
  sellingPlanGroupCreate(
    input: {
      name: "Subscribe and save"
      merchantCode: "subscribe-and-save"
      options: ["Delivery every"]
      position: 1
      sellingPlansToCreate: [
        {
          name: "Delivered every week"
          options: "1 Week(s)"
          position: 1
          billingPolicy: { recurring: { interval: WEEK, intervalCount: 1 } }
          deliveryPolicy: { recurring: { interval: WEEK, intervalCount: 1 } }
          pricingPolicies: [
            {
              fixed: {
                adjustmentType: PERCENTAGE
                adjustmentValue: { percentage: 15.0 }
              }
            }
          ]
        }
        {
          name: "Delivered every two weeks"
          options: "2 Week(s)"
          position: 2
          billingPolicy: { recurring: { interval: WEEK, intervalCount: 2 } }
          deliveryPolicy: { recurring: { interval: WEEK, intervalCount: 2 } }
          pricingPolicies: [
            {
              fixed: {
                adjustmentType: PERCENTAGE
                adjustmentValue: { percentage: 10.0 }
              }
            }
          ]
        }
        {
          name: "Delivered every three weeks"
          options: "3 Week(s)"
          position: 3
          billingPolicy: { recurring: { interval: WEEK, intervalCount: 3 } }
          deliveryPolicy: { recurring: { interval: WEEK, intervalCount: 3 } }
          pricingPolicies: [
            {
              fixed: {
                adjustmentType: PERCENTAGE
                adjustmentValue: { percentage: 5.0 }
              }
            }
          ]
        }
      ]
    }
    resources: { productIds: [], productVariantIds: [] }
  ) {
    sellingPlanGroup {
      id
    }
    userErrors {
      field
      message
    }
  }
}
      `,
  variables: {
    now: new Date().toISOString(),
  },
};

const getSellingPlans = {
  query: `
  query GetSellingPlanGroups($after:String, $before:String, $first:Int, $last:Int,$query:String) {
    sellingPlanGroups(after:$after, before:$before, first:$first, last:$last, query:$query) {
      edges{
        cursor
        node {
          appId
          description
          id
          name
          merchantCode
        }
      }
      pageInfo{
hasNextPage
hasPreviousPage
      }
    }
  }
  `,
  operationName: "GetSellingPlanGroups",
  variables: {},
};

module.exports = {
  token,
  request,
  getSellingPlans,
};
