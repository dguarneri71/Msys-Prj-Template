# msys-prj-template

## Summary

Esempio di progetto SPFX da utilizzare come template.

TODO:
- Creare classe SPDataService che usa PnP (ultima versione???) con metodi CRUD su lista
- Modificare file di config e manifets per spiegare impatti sul codice e sulla solution (nome della webpart, della solution etc.)
- Aggiungere Command Set
- Aggiungere Custom Field

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.19.0-green.svg)
Node 18.20.4

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites
Install:
1. [PnP/PnPjs](https://pnp.github.io/pnpjs/) v. - npm install @pnp/sp @pnp/graph --save
2. [@pnp/spfx-property-controls](https://pnp.github.io/sp-dev-fx-property-controls/) v.3 - npm install @pnp/spfx-property-controls --save --save-exact
3. [@pnp/spfx-controls-react](https://pnp.github.io/sp-dev-fx-controls-react/) v.3 - npm install @pnp/spfx-controls-react --save --save-exact

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| Msys-Prj-Template | Daniele Guarneri |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.0.0.0     | Marzo 28, 2025 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

> Include any additional steps as needed.

## Features

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Set up SharePoint Framework development environment](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 
- [Build your first Field Customizer extension](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/extensions/get-started/building-simple-field-customizer)

## Command
yo @microsoft/sharepoint

gulp serve --configuration "fieldTemplate"