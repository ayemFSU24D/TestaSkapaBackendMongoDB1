# App repo tasks

This file lists the recommended files and tasks for the application repository.

## Required files & tasks - Backend App

- [ ] README.md — overview + run & deploy steps
- [ ] .gitignore — ignore node_modules, .env, dist, etc.
- [ ] package.json — dependencies and scripts
- [ ] tsconfig.json — TypeScript configuration
- [ ] .dockerignore — files to exclude from Docker context
- [ ] src/ — application source
  - [ ] index.ts — server entry
  - [ ] controllers/ — route handlers
  - [ ] services/ — business logic
  - [ ] db/ — db connection and models
  - [ ] types/ — TypeScript types/interfaces
  - [ ] config/ — configuration and env-loading
  - [ ] routes/ — express routes
- [ ] tests/ — unit & integration tests
- [ ] scripts/ — helper scripts
- [ ] Dockerfile — multi-stage build for TypeScript
- [ ] docker-compose.yaml — local dev compose (backend + mongo)

## CI/CD (GitHub Actions) - Infra folder
- [ ] .github/workflows/ci.yml — install, lint, test, build
- [ ] .github/workflows/cd.yml — build image, push to ACR, deploy to Container Apps

## Recommended dev tasks 
- [ ] Add `/health` endpoint
- [ ] Add '/someendpoint' GET endpoint 
- [ ] Add graceful DB retry logic and timeouts
- [ ] Add logging and structured logs
- [ ] Add basic unit tests (Jest) and one integration test against local mongo
- [ ] Add ESLint and Prettier configs
- [ ] Add README run commands and deploy overview

## Notes
- Use environment variables for sensitive data. Keep `.env` out of source control.
- For TypeScript transition, add `src/` and output `dist/` build artifacts.
