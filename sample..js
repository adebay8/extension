const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczpcL1wvYWRlYmF5by1kZXYtc3RvcmUubXlzaG9waWZ5LmNvbVwvYWRtaW4iLCJkZXN0IjoiaHR0cHM6XC9cL2FkZWJheW8tZGV2LXN0b3JlLm15c2hvcGlmeS5jb20iLCJhdWQiOiIxNjg1ODRkZjVlZTc5ZDUzNmEyNjJhMWU2NmRlNTJkZiIsInN1YiI6IjczMTU3NzM4NTg5IiwiZXhwIjoxNjQ0MjUxMTgxLCJuYmYiOjE2NDQyNTExMjEsImlhdCI6MTY0NDI1MTEyMSwianRpIjoiZjY5NzEzZWMtNjJiOC00OTRhLTlhYmEtMmY0NDFhNWMyYWYxIiwic2lkIjoiMDIxZThlODlhZmZhM2MyZDdkYjVmOTgzYTkwODk4ZDMxMDJhMmIyNmVlMTNjYWQwZWE5MTViY2E3YTI4YTVkYyJ9.e4yLSRv7LmAyMo9cwo0bv9hKgl-LHMzxTfNFRJJFTig";

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
