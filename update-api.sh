wget http://127.0.0.1:4571/openapi.json -O connector/openapi.json;
pnpm dlx openapi-typescript connector/openapi.json --default-non-nullable --output src/connector/openapi.d.ts;