# Overleaf OIDC User Manager

The Overleaf community edition does not provide LDAP and SAML functionality. Existing projects, such as [smhaller/ldap-overleaf-sl](https://github.com/smhaller/ldap-overleaf-sl), require modifying the Overleaf source code and need to be re-patched when updates occur.

If you can accept not supporting OIDC login but allow users from an identity provider to self-register accounts, then you can use this project. This project allows OIDC users to self-register accounts and only use OIDC Email for registration.

## Requirements

The project assumes deployment using overleaf-toolkit, following default settings.

## Deployment

The project consists of an API endpoint written in Python and a simple page written in Next.js. The former uses MongoDB to connect to Overleaf's database and uses the Docker API to execute commands in the Overleaf container to create users. The latter provides OIDC login authorization and utilizes the former's API to implement self-registration.

Please refer to the [docker-compose.yaml](./docker-compose.yaml) file for deployment.