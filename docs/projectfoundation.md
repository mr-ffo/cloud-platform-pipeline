# Building a Production-Ready Cloud Platform with Pulumi: Part 1 — Project Foundation

## Introduction

When most people learn Pulumi, the journey usually ends after successfully running:

```bash
pulumi up
```

While this provisions cloud resources, it does not reflect how Infrastructure as Code (IaC) is managed in professional engineering teams.

Real production environments require much more than simply deploying infrastructure. They require:

* Clean project architecture
* Automated quality checks
* Consistent code formatting
* Modular infrastructure design
* Continuous Integration (CI)
* Security-first engineering practices

The goal of this project is to build a **production-grade cloud platform** using **Pulumi**, **AWS**, and **GitHub Actions**, while following engineering practices commonly found in mature DevOps and Platform Engineering teams.

This article documents the first phase of that journey.

---

# Project Goals

This project is not intended to be another "deploy an S3 bucket" tutorial.

Instead, it aims to demonstrate how modern infrastructure projects should be structured.

By the end of the project, the platform will include:

* Modular Infrastructure as Code
* CI/CD pipelines
* Security scanning
* Infrastructure validation
* Monitoring
* Deployment approvals
* Cost protection
* Drift detection
* Cloud monitoring and alerting

---

# Why Pulumi?

Infrastructure has traditionally been written using declarative tools such as CloudFormation or Terraform.

Pulumi approaches the problem differently.

Instead of learning another configuration language, infrastructure is written using familiar programming languages such as:

* TypeScript
* Python
* Go
* C#
* Java

This provides several advantages:

* Code reuse
* Functions
* Loops
* Strong typing
* IDE support
* Testing
* Modular architecture

Infrastructure becomes software rather than configuration.

---

# Project Structure

Instead of placing every AWS resource inside a single file, the project was organized into independent infrastructure modules.

```
infra/
│
├── config/
├── storage/
├── networking/
├── security/
├── monitoring/
├── website/
├── outputs/
└── index.ts
```

Each module has one responsibility.

For example:

* Storage owns S3 resources.
* Security owns IAM policies and security services.
* Monitoring owns CloudWatch resources.
* Networking owns CloudFront and networking components.

This follows the **Single Responsibility Principle (SRP)** and keeps the infrastructure maintainable as the platform grows.

---

# Converting `infra/index.ts` into an Orchestrator

Initially, the Pulumi template generated infrastructure directly inside the root entry file.

Instead, the project was refactored so that the root file only composes infrastructure modules.

```ts
import "./storage";
```

Later, this file will simply import every infrastructure module.

```ts
import "./config";
import "./storage";
import "./networking";
import "./security";
import "./monitoring";
import "./website";
import "./outputs";
```

The root no longer owns infrastructure.

It only orchestrates modules.

This architecture scales significantly better than maintaining hundreds or thousands of lines in a single file.

---

# Building the First Module

The Storage module became the first independently managed infrastructure component.

```ts
export const bucket = new aws.s3.Bucket("platform-storage", {
    forceDestroy: false,
});

export const bucketName = bucket.id;
```

This module now owns storage responsibilities and exposes only what other modules need.

Future additions will include:

* Versioning
* Encryption
* Lifecycle policies
* Backup configuration
* Replication

---

# Why `forceDestroy: false` Matters

One seemingly small configuration has an important impact.

```ts
forceDestroy: false
```

If the bucket contains objects, Pulumi refuses to delete it.

This protects production data from accidental deletion during a `pulumi destroy`.

Safety mechanisms like this are essential when building infrastructure that may eventually host production workloads.

---

# Organizing Infrastructure by Responsibility

Rather than organizing resources by AWS service alone, they are grouped according to platform responsibility.

```
Storage

↓

Networking

↓

Security

↓

Monitoring

↓

Website

↓

Outputs
```

This makes navigation easier for future contributors and mirrors how many engineering teams organize large Infrastructure-as-Code repositories.

---

# Setting Up Continuous Integration

Infrastructure should never be deployed without validation.

A GitHub Actions workflow was introduced to automate quality checks whenever code is pushed or submitted through a pull request.

Current validation includes:

* Dependency installation
* TypeScript compilation
* npm security audit

As the project evolves, additional stages will be introduced.

---

# TypeScript Validation

Before infrastructure is executed, the repository ensures that all TypeScript code successfully compiles.

```
npm run build
```

This prevents simple syntax and type errors from reaching deployment.

---

# Code Quality with ESLint

Static analysis was introduced using ESLint.

Unused imports, inconsistent coding patterns, and common mistakes are detected before infrastructure changes reach AWS.

Keeping the repository free of warnings improves long-term maintainability.

---

# Consistent Formatting with Prettier

Formatting differences create noisy pull requests.

To eliminate unnecessary formatting discussions, Prettier was introduced.

Configuration was standardized through:

* `prettier.config.mjs`
* `.prettierignore`

New project scripts were also added.

```
npm run format

npm run format:check
```

During development, `format` automatically fixes formatting.

Inside CI, `format:check` ensures developers cannot merge inconsistently formatted code.

---

# Quality Gates Introduced

The repository now contains several automated quality gates.

```
TypeScript Build

↓

ESLint

↓

Prettier

↓

npm Audit
```

Every stage increases confidence that the infrastructure code is healthy before deployment.

---

# What Comes Next?

This foundation prepares the project for more advanced platform engineering capabilities.

Future phases will introduce:

* Secret scanning with Gitleaks
* Infrastructure security scanning using Checkov
* Pulumi Preview inside GitHub Actions
* Manual deployment approvals
* CloudWatch monitoring
* SNS notifications
* AWS Budgets
* Drift detection
* AI-assisted operations

The goal is to move beyond simply deploying infrastructure and instead build a complete production-ready cloud platform.

---

# Conclusion

Infrastructure is no longer just about provisioning cloud resources.

Modern Platform Engineering combines software engineering principles, automation, security, and operational excellence.

By introducing modular architecture, automated validation, consistent formatting, and CI from the beginning, the project establishes a strong foundation that can safely evolve into a secure, scalable cloud platform.

This is only the beginning.
