# CHIF API Client

This is an example CHIF API client for Node.js.

## Getting Started

```sh
# Download the client
$ git clone https://github.com/C-Hear/chif-api-client

# Install dependencies
$ cd chif-api-client
$ npm install
```

You will also need to get your Organization ID (`--org_id`) and API Token (`--token`) from C-Hear. You can provide these with each command call, or the client will try to read these from `./.env`:

```ini
CHIF_ORG_ID=your-org-id
CHIF_API_TOKEN=your-api-token
```

## Commands

```
chif-api.mjs <command>

Commands:
  chif-api.mjs create    Create CHIF
  chif-api.mjs status   Get CHIF task status
  chif-api.mjs download  Download completed CHIF
  chif-api.mjs block     Block CHIF
  chif-api.mjs unblock   Unblock CHIF
  chif-api.mjs getBlock  Get CHIF block status

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --url      API base URL
     [string] [required] [default: "https://extchifmanagerv5.azurewebsites.net"]
  --org_id   Organization ID                                 [string] [required]
  --token    API token                                       [string] [required]
```

### Create

Create and download a CHIF file from a [manifest](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#create-a-chif).

API reference:
- [Create A CHIF](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#create-a-chif)
- [Get CHIF File Task Status by Task ID](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#get-chif-file-task-status-by-task-id)
- [Get CHIF File by Downloadable Link](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#get-chif-file-by-downloadable-link)

```
chif-api.mjs create

Create CHIF

Options:
  --manifest  CHIF manifest                                  [string] [required]
  --chif      CHIF filename                                  [string] [required]
```

### Status

Get CHIF creation task status.

API reference:
- [Get CHIF File Task Status by Task ID](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#get-chif-file-task-status-by-task-id)

```
chif-api.mjs status

Get CHIF task status

Options:
  --uuid     CHIF UUID                                       [string] [required]
```

### Download

Download a completed CHIF.

API reference:
- [Get CHIF File by Downloadable Link](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#get-chif-file-by-downloadable-link)

```
chif-api.mjs download

Download completed CHIF

Options:
  --uuid     CHIF UUID                                       [string] [required]
  --chif     CHIF filename                                   [string] [required]
```

### Block

Block a CHIF.

API reference:
- [Block CHIF File](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#block-chif-file)

```
chif-api.mjs block

Block CHIF

Options:
  --uuid     CHIF UUID                                       [string] [required]
  --code     Block code                                      [number] [required]
  --reason   Block reason                                    [string] [required]
```

### Unblock

Unblock a CHIF.

API reference:
- [Un Block CHIF File](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#un-block-chif-file)

```
chif-api.mjs unblock

Unblock CHIF

Options:
  --uuid     CHIF UUID                                       [string] [required]
```

### Get Block

Get a CHIF's block status.

API reference:
- [Get CHIF File Blocked Description](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#get-chif-file-blocked-description)

```
chif-api.mjs getBlock

Get CHIF block status

Options:
  --uuid     CHIF UUID                                       [string] [required]
```
