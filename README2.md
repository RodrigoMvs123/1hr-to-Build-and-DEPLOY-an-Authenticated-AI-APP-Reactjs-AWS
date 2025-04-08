## 1hr to Build and DEPLOY an Authenticated AI APP! React.js + AWS

- https://www.youtube.com/watch?v=Ao5TF4yUNXQ 

AWS 

- https://aws.amazon.com/developer/language/javascript/?nc1=h_ls

Build a Serverless Web Application using Generative AI

- https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-amplify-bedrock-cognito-gen-ai/ 

Region 

- N. Virginia       us-east-1

#### Visual Studio Code
Terminal
``` 
npm install vite --save-dev
npm create vite@latest travel-destination-generator -- --template react-ts -y 
npm i
npm run dev
```

Terminal 
```
npm create amplify@latest -y 
```

#### Visual Studio Code
```
Explorer
Open Editors
travel-destination-generator/amplify/auth/resources.ts
```

travel-destination-generator/amplify/auth/resources.ts
```ts
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
    loginWith: {
        email: {
            verificationEmailStyle: "CODE",
            verificationEmailSubject: "Welcome to the Travel Destination Generator!",
            verificationEmailBody: (createCode) =>
          `Use this code to confirm your account: ${createCode()}`,
        },
    },
});
```

#### AWS Console

Amazon Bedrock 
```
View Model Catalog
Claude 3 Sonnet 
    - Modify Access
Base Models
    Claude 3 Sonnet / Available to request 
                      Request model access
                        - Next
Add use case details for Anthropic
    - Use case Details 
       Company Name 
          - Code with Ania
       Company website URL 
          - https://www.codewithania.com
       What industry do you operate in?
          - Education
       How are your intended users?
          - Internal employees
       Describe your use cases
            - This is for a demo.
               - Next
                  - Submit
```

#### Visual Studio Code
```
Explorer
Open Editors
travel-destination-generator/amplify/auth/resources.ts
travel-destination-generator/amplify/data/bedrock.js 
```

travel-destination-generator/amplify/data/bedrock.js 
```js   
export function request(ctx) {
    const { interrest = [] } = ctx.args;

    const prompt = `Suggest a travel destination using these interests: ${interests.join(", ")}.`;

    return {
         resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
         method: "POST",
         params: {
            headers: {
                "contentType": "application/json",
         },
         body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `\n\nHuman: ${prompt}\n\nAssistant:`
                            }
                        ]
                    }
                ]
         })
    }
}

export function response(ctx) {
    const parsedBody = JSON.parse(ctx.response.body);
    const res = {
        body: parsedBody.content[0].text,
    };
    return res;
}
```

#### Visual Studio Code
```
Explorer
Open Editors
travel-destination-generator/amplify/auth/resources.ts
travel-destination-generator/amplify/data/bedrock.js 
travel-destination-generator/amplify/backend.ts
```

travel-destination-generator/amplify/backend.ts 
```ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resources';
import { data } from './data/resources';
import { PoliceStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
    auth,
    data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
    "bedrockDS",
    "https://bedrock-runtime.us-east-1.amazonaws.com",
    {
      authorizationConfig: {
        signingRegion: "us-east-1",
        signingServiceName: "bedrock",
      },
    }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
    new PolicyStatement({
      resources: [
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
      ],
      actions: ["bedrock:InvokeModel"],

    })
);
```

#### Visual Studio Code
```
Explorer
Open Editors
travel-destination-generator/amplify/auth/resources.ts
travel-destination-generator/amplify/data/bedrock.js 
travel-destination-generator/amplify/backend.ts
travel-destination-generator/amplify/data/resources.ts
```

travel-destination-generator/amplify/data/resources.ts
```ts
```
