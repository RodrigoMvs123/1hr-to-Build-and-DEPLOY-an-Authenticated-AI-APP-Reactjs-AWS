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
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  BedrockResponse: a.customType({
    body: a.string(),
    error: a.string(),
  }),

  askBedrock: a
      .query()
      .arguments({ interests: a.string().array() })
      .returns(a.ref("BedrockResponse"))
      .authorization((allow) => [allow.authenticated()])
      .handler(
          a.handler.custom({ entry: "./bedrock.js", dataSource: "bedrockDS" })
      ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

#### Visual Studio Code
Terminal
```
npx ampx sandbox
> 
    amplify_outputs.json ( After tutorial to deactivated from aws account )

npm install aws-amplify @aws-amplify/ui-react // Ui content 
```

#### Visual Studio Code
```
Explorer
Open Editors
travel-destination-generator/amplify/auth/resources.ts
travel-destination-generator/amplify/data/bedrock.js 
travel-destination-generator/amplify/backend.ts
travel-destination-generator/amplify/data/resources.ts
travel-destination-generator/src/main.tsx
```

travel-destination-generator/src/main.tsx
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Authenticator } from "@aws-amplify/ui-react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Authenticator>
        <App />
      </Authenticator>
  </StrictMode>,
)
```

#### Visual Studio Code
```
Explorer
Open Editors
travel-destination-generator/amplify/auth/resources.ts
travel-destination-generator/amplify/data/bedrock.js 
travel-destination-generator/amplify/backend.ts
travel-destination-generator/amplify/data/resources.ts
travel-destination-generator/src/main.tsx
travel-destination-generator/src/App.tsx
```

travel-destination-generator/src/App.tsx
```tsx
import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs)

const amplifyClient = generateClient<Schema>({
    authMode: "userPool",
});

function App () {
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            const { data, errors } = await amplifyClient.queries.askBedrock({
                interests: [formData.get("interests")?.toString() || ""],
            });

            if (!errors) {
                setResult(data?.body || "No data returned");
            } else {
                console.log(errors);
            }

            } catch (e) {
                alert(`An error occurred: ${e}`);
            } finally {
            setLoading(false);
        }
    }

    return (
        <div className="app-container">
            <div className="header-container">
                <h1 className="main-header">Meet Your Personal
                    <span className="highlight"> Travel Destination Generator</span>
                </h1>
                <p className="description">
                    Simply type a few interests using the format interest1, interest2, etc...
                    and the generator will comeback with great destinations for you.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="search-container">
                    <input
                        type="text"
                        className="wide-input"
                        id="interests"
                        name="interests"
                        placeholder="interest1, interest2, interest3,...etc"
                    />
                    <button type="submit" className="search-button">
                        Generate
                    </button>
                </div>
            </form>

            <div className="result-container">
                {loading ? (
                    <div className="loader-container">
                        <p>Loading...</p>
                        <Loader size="large"/>
                        <Placeholder size="large"/>
                        <Placeholder size="large"/>
                        <Placeholder size="large"/>
                    </div>
                ) : (
                    result && <p className="result">{result}</p>
                )}
            </div>
        </div>
    )
}

export default App
```

#### Visual Studio Code
```
Explorer
Open Editors
travel-destination-generator/amplify/auth/resources.ts
travel-destination-generator/amplify/data/bedrock.js 
travel-destination-generator/amplify/backend.ts
travel-destination-generator/amplify/data/resources.ts
travel-destination-generator/src/main.tsx
travel-destination-generator/src/App.tsx
travel-destination-generator/src/index.css
```

travel-destination-generator/src/index.css
```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color: rgba(255, 255, 255, 0.87);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

.box:nth-child(3n + 1) {
  grid-column: 1;
}
.box:nth-child(3n + 2) {
  grid-column: 2;
}
.box:nth-child(3n + 3) {
  grid-column: 3;
}
```

#### Visual Studio Code
```
Explorer
Open Editors
travel-destination-generator/amplify/auth/resources.ts
travel-destination-generator/amplify/data/bedrock.js 
travel-destination-generator/amplify/backend.ts
travel-destination-generator/amplify/data/resources.ts
travel-destination-generator/src/main.tsx
travel-destination-generator/src/App.tsx
travel-destination-generator/src/index.css
travel-destination-generator/src/app.css
```

travel-destination-generator/src/app.css
```css
.app-container {

  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.header-container {
  padding-bottom: 2.5rem;
  margin:  auto;
  text-align: center;

  align-items: center;
  max-width: 48rem;


}

.main-header {
  font-size: 2.25rem;
  font-weight: bold;
  color: #1a202c;
}

.main-header .highlight {
  color: #2563eb;
}

@media (min-width: 640px) {
  .main-header {
    font-size: 3.75rem;
  }
}

.description {

  font-weight: 500;
  font-size: 1.125rem;
  max-width: 65ch;
  color: #1a202c;
}

.form-container {
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.wide-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-button {
  width: 100%; /* Make the button full width */
  max-width: 300px; /* Set a maximum width for the button */
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

.result-container {
  margin-top: 20px;
  transition: height 0.3s ease-out;
  overflow: hidden;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.result {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 15px;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: black;
  font-weight: bold;
  text-align: left; /* Align text to the left */
}
```

#### Github UI

Create a new repository 
```
Repository name
travel-destination-generator
Description
An app that generates travel destinations based on user interests using AWS Amplify and Bedrock.
```

#### Visual Studio Code
Terminal
```
git init
git add .
git commit -m "first commit"
git remote add origin git@github.com:rodrigomvs123ai/travel-destination-generator.git
git branch -M main
git push -u origin main -f
```

#### Deploy your app with AWS Amplify (AWS)

- https://console.aws.amazon.com/amplify/apps

Deploy an app

> Choose source code provider 

- Github 
   - Next
  
> Add repository and branch 
  
- rodrigomvs123ai/travel-destination-generator
   - Next

> App settings 

...
   - Next

   - Save and deploy 


   











