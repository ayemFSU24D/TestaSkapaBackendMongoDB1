# Infra tasks

This file lists recommended infra files and tasks. Place infra files under `infra/` in this repo, or prefer a separate `infra-repo` for production.

## Required files & tasks

- [ ] azure-mongo.yaml — ARM/Bicep or Container Apps YAML for DB service
- [ ] azure-app.yaml — Container Apps resource definition (secrets placeholders)
- [ ] bicep/ or arm-templates/ — reusable templates (recommended Bicep)
- [ ] .github/workflows/deploy-infra.yml — pipeline to deploy infra on push to `main`

## CI/CD pipeline items
- [ ] Create GitHub secret `AZURE_CREDENTIALS` containing a service principal JSON
- [ ] Create pipeline `deploy-infra.yml` to run `az deployment group create` or `az deployment sub create` for Bicep/ARM
- [ ] Use `depends_on` or proper ordering if deploying multiple resources

## Operational tasks
- [ ] Decide where MongoDB will run in production: CosmosDB (Mongo API), Atlas, or Container App (not recommended for prod)
- [ ] Add storage/backup strategy for databases (snapshots/backups)
- [ ] Add monitoring: Log Analytics workspace, alerts, and metrics
- [ ] Add Key Vault integration for secrets (optional but recommended)

## Notes
- Prefer Bicep for maintainability and modular templates.
- Keep infra in a separate repo (`infra-repo`) if multiple projects share resources. If you keep infra in this repo, use `infra/` directory and workflows that trigger only on changes to `infra/**`.
