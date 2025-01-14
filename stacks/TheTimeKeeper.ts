import { Api, StaticSite, StackContext, Table, Auth } from "sst/constructs";

export function TheTimeKeeper({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, "Projects", {
    fields: {
      ProjectId: "string",
    },
    primaryIndex: { partitionKey: "ProjectId" },
  });
  // Create the HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        // Bind the table name to our API
        bind: [table],
      },
    },
    routes: {
      "POST /": "packages/functions/src/lambda.main",
    },
  });

  const site = new StaticSite(stack, "VueJSSite", {
    path: "packages/frontend",
    buildOutput: "dist",
    buildCommand: "npm run build",
    errorPage: "redirect_to_index_page",
    environment: {
      // Pass in the API endpoint to our app
      VITE_APP_API_URL: api.url,
    },
  });
  
  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "packages/functions/src/auth.handler",
    },
  });

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });
}
