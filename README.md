# Overleaf OIDC User Manager

The Overleaf community edition does not provide LDAP and SAML functionality. Existing projects, such as [smhaller/ldap-overleaf-sl](https://github.com/smhaller/ldap-overleaf-sl), require modifying the Overleaf source code and need to be re-patched when updates occur.

If you can accept not supporting OIDC login but allowing users from an identity provider to self-register accounts, then you can use this project. This project allows OIDC users to self-register accounts and only use OIDC Email for registration.

## Requirements

The project assumes deployment using overleaf-toolkit, following default settings.

## Deployment

The project consists of an API endpoint written in Python and a simple page written in Next.js. The API uses MongoDB to connect to Overleaf's database and the Docker API to execute commands in the Overleaf container to create users. The Next.js page provides OIDC login authorization and utilizes the API to implement self-registration.

First, prepare the environment file from `.env.example`. Modify `OVERLEAF_CONNECTOR_API_KEY` and OIDC settings as needed.

Then use Docker Compose:

```yaml
---
services:
  connector-api:
    image: ghcr.io/moeakwak/overleaf-connector-api
    container_name: overleaf-connector-api
    ports:
      - "127.0.0.1:4571:4571"
    env_file: .env
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - overleaf_default
  
  oidc-usermanager:
    image: ghcr.io/moeakwak/overleaf-oidc-usermanager
    container_name: overleaf-oidc-usermanager
    ports:
      - "3000:3000"
    env_file: .env
    networks:
      - overleaf_default
    depends_on:
      - connector-api

networks:
  overleaf_default:
    external: true
```

You may use `ghcr.io/moeakwak/overleaf-connector-api` seperately, if you only need an HTTP API for getting and creating users without a UI.