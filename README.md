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
  chif-api.mjs encode     Encode CHIF
  chif-api.mjs decode     Decode CHIF
  chif-api.mjs status     Get CHIF task status
  chif-api.mjs download   Download encoded CHIF
  chif-api.mjs getEvents  Get recent CHIF events
  chif-api.mjs block      Block CHIF
  chif-api.mjs unblock    Unblock CHIF
  chif-api.mjs getBlock   Get CHIF block status
  chif-api.mjs delete     Delete CHIF
  chif-api.mjs publish    Publish CHIF
  chif-api.mjs unpublish  Unpublish CHIF
  chif-api.mjs getFiles   Get CHIF files information

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --url      API base URL
     [string] [required] [default: "https://extchifmanagerv5.azurewebsites.net"]
  --org_id   Organization ID                                 [string] [required]
  --token    API token                                       [string] [required]
  --log      Log file                         [string] [default: "chif-api.log"]
```

### Encode

Encode and download a CHIF file from a [manifest](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#create-a-chif).

API reference:
- [Create A CHIF](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#create-a-chif)
- [Get CHIF File Task Status by Task ID](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#get-chif-file-task-status-by-task-id)
- [Get CHIF File by Downloadable Link](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#get-chif-file-by-downloadable-link)

```
chif-api.mjs encode

Encode CHIF


Options:
  --manifest  CHIF manifest                                  [string] [required]
  --chif      CHIF filename                                  [string] [required]
  --download  Download encoded CHIF                    [boolean] [default: true]
  --publish   Publish encoded CHIF to CDN             [boolean] [default: false]
```

### Decode

Decode a CHIF and download its zipped contents.

```
chif-api.mjs decode

Decode CHIF

Options:
  --chif      CHIF filename                                  [string] [required]
  --manifest  CHIF manifest                                  [string] [required]
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

### Get Events

Get recent events for a CHIF. These are written to standard output in CSV form, so you probably want to pipe them to a file (e.g.):

```sh
$ node chif-api.mjs getEvents --uuid $UUID > events.csv
```

API reference:
- [Get CHIF File Event Data by File Name](https://github.com/C-Hear/ext-chif-manager-azure-v5/tree/main/server#get-chif-file-event-data-by-file-name)

```
chif-api.mjs getEvents

Get recent CHIF events

Options:
  --uuid     CHIF UUID                                       [string] [required]
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

### Delete

Delete an encoded CHIF.

API reference:
- [Delete CHIF File](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#delete-chif-file)

```
chif-api.mjs delete

Delete CHIF

Options:
  --uuid     CHIF UUID                                       [string] [required]
```

### Publish

Publish an encoded CHIF to CDN

```
chif-api.mjs publish

Publish CHIF

Options:
  --uuid     CHIF UUID                                       [string] [required]
```

### Unpublish

Unpublish a previously-published CHIF file from CDN

```
chif-api.mjs unpublish

Unpublish CHIF

Options:
  --uuid     CHIF UUID                                       [string] [required]
```

### Get Files

Get file information for encoded CHIFs.

API reference:
- [Get CHIF File Information by Organization ID](https://github.com/C-Hear/documentation/blob/master/manager/API/readmeAzureV5.md#get-chif-file-entry-information-by-organization-id)

```
chif-api.mjs getFiles

Get CHIF files information
```
