#!/usr/bin/env node

import axios from 'axios';
import { config } from 'dotenv';
import FormData from 'form-data';
import fs from 'fs/promises';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import { pipeline } from 'stream/promises';
import yargs from 'yargs';

// Read settings from .env
config();

const args = yargs(hideBin(process.argv))
  .option('url', {
    type: 'string',
    description: 'API base URL',
    default: process.env.CHIF_API_URL || 'https://extchifmanagerv5.azurewebsites.net',
    demandOption: true,
  })
  .option('org_id', {
    type: 'string',
    description: 'Organization ID',
    default: process.env.CHIF_ORG_ID,
    demandOption: true,
  })
  .option('token', {
    type: 'string',
    description: 'API token',
    default: process.env.CHIF_API_TOKEN,
    demandOption: true,
  })
  .option('log', {
    type: 'string',
    description: 'Log file',
    default: 'chif-api.log',
  })
  .command('encode', 'Encode CHIF', (yargs) => yargs
    .option('manifest', {
      type: 'string',
      description: 'CHIF manifest',
      demandOption: true,
    })
    .option('chif', {
      type: 'string',
      description: 'CHIF filename',
      demandOption: true,
    })
    .option('download', {
      type: 'boolean',
      description: 'Download encoded CHIF',
      default: true,
    })
    .option('publish', {
      type: 'boolean',
      description: 'Publish encoded CHIF to CDN',
      default: false
    }))
  .command('decode', 'Decode CHIF', (yargs) => yargs
    .option('chif', {
      type: 'string',
      description: 'CHIF filename',
      demandOption: true,
    })
    .option('manifest', {
      type: 'string',
      description: 'CHIF manifest',
      demandOption: true,
    }))
  .command('status', 'Get CHIF task status', (yargs) => yargs
    .option('uuid', {
      type: 'string',
      description: 'CHIF UUID',
      demandOption: true,
    }))
  .command('download', 'Download completed CHIF', (yargs) => yargs
    .option('uuid', {
      type: 'string',
      description: 'CHIF UUID',
      demandOption: true,
    })
    .option('chif', {
      type: 'string',
      description: 'CHIF filename',
      demandOption: true,
    }))
  .command('block', 'Block CHIF', (yargs) => yargs
    .option('uuid', {
      type: 'string',
      description: 'CHIF UUID',
      demandOption: true,
    })
    .option('code', {
      type: 'number',
      description: 'Block code',
      demandOption: true,
    })
    .option('reason', {
      type: 'string',
      description: 'Block reason',
      demandOption: true,
    }))
  .command('unblock', 'Unblock CHIF', (yargs) => yargs
    .option('uuid', {
      type: 'string',
      description: 'CHIF UUID',
      demandOption: true,
    }))
  .command('getBlock', 'Get CHIF block status', (yargs) => yargs
    .option('uuid', {
      type: 'string',
      description: 'CHIF UUID',
      demandOption: true,
    }))
  .command('getFiles', 'Get CHIF files information')
  .command('delete', 'Delete CHIF', (yargs) => yargs
    .option('uuid', {
      type: 'string',
      description: 'CHIF UUID',
      demandOption: true,
    }))
  .command('publish', 'Publish CHIF', (yargs) => yargs
    .option('uuid', {
      type: 'string',
      description: 'CHIF UUID',
      demandOption: true,
    }))
  .command('unpublish', 'Unpublish CHIF', (yargs) => yargs
    .option('uuid', {
      type: 'string',
      description: 'CHIF UUID',
      demandOption: true,
    }))
  .demandCommand(1)
  .parse();

const api = axios.create({
  baseURL: `${args.url}/api/`,
  headers: {
    Authorization: `Bearer ${args.token}`,
  },
});

let log = (message) => console.error(message);

withDefer(async (defer) => {
  if (args.log) {
    const logFile = await fs.open(args.log, 'a', 0o644);
    defer(() => logFile.close());

    log = wrap(log, (log) => async (message) => {
      log(message);
      await logFile.write(`${new Date().toISOString()}: ${message}\n`);
    });
  }

  try {
    switch (args._[0]) {
      case 'encode':
        await encode(args.manifest, args.chif, args.download, args.publish);
        break;
      case 'decode':
        await decode(args.chif, args.manifest);
        break;
      case 'status':
        await log(`Getting ${args.uuid} status`);
        const task = await status(args.uuid);
        console.log(JSON.stringify(task, null, '  '));
        break;
      case 'download':
        await download(args.uuid, args.chif);
        break;
      case 'block':
        await block(args.uuid, args.code, args.reason);
        break;
      case 'unblock':
        await unblock(args.uuid);
        break;
      case 'getBlock': {
        const block = await getBlock(args.uuid);
        console.log(JSON.stringify(block, null, '  '));
        break;
      }
      case 'getFiles':
        await getFiles();
        break;
      case 'delete':
        await del(args.uuid);
        break;
      case 'publish':
        const { url } = await publish(args.uuid);
        log(`CDN URL: ${url}`);
        break;
      case 'unpublish':
        await unpublish(args.uuid);
        break;
      default:
        log(`Unknown command: ${args._[0]}`);
        break;
    }
  } catch (err) {
    await log(err.stack);
  }
});

function encode(manifest, chif, shouldDownload, shouldPublish) {
  return withDefer(async (defer) => {
    await log(`Encoding ${chif} from ${manifest}`);
    const dir = path.resolve(path.dirname(manifest));

    const form = new FormData();
    form.append('chifFilename', path.basename(chif).replace(/\.chif$/i, ''));

    // Attach the manifest
    const manifestContent = await fs.readFile(manifest);
    form.append('manifest', manifestContent, { filename: manifest });

    const manifestData = JSON.parse(manifestContent);
    for (const [name, part] of Object.entries(manifestData.files.parts)) {
      // Attach each file
      const handle = await fs.open(path.resolve(dir, part.filename));
      defer(() => handle.close());

      form.append(name, handle.createReadStream(), { filename: part.filename || name });
    }

    await log('Submitting encode task');
    let response = await api.post(`encoder/org_id/${args.org_id}`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    const uuid = response.data.task_id;
    log(`CHIF UUID: ${uuid}`);

    // Check the status
    await log('Waiting on task');
    while (true) {
      const { queue_status } = await status(uuid);
      if (queue_status === 'failed') {
        throw new Error('Task failed');
      } else if (queue_status === 'completed') {
        break;
      }

      await sleep(500);
    }

    if (shouldDownload) {
      await download(uuid, chif);
    }

    if (shouldPublish) {
      const { url } = await publish(uuid);
      log(`CDN URL: ${url}`);
    }
  });
}

function decode(chif, manifest) {
  return withDefer(async (defer) => {
    await log(`Decoding ${chif} with ${manifest}`);

    const form = new FormData();

    // Attach the CHIF
    const chifHandle = await fs.open(chif);
    defer(() => chifHandle.close());
    form.append('chif', chifHandle.createReadStream(), { filename: chif });

    // Attach the manifest
    const manifestHandle = await fs.open(manifest);
    defer(() => manifestHandle.close());
    form.append('manifest', manifestHandle.createReadStream(), { filename: manifest });

    const response = await api.post(`decoder/org_id/${args.org_id}`, form, {
      headers: {
        ...form.getHeaders(),
      },
      responseType: 'stream'
    });

    const filename = response.headers['content-disposition'].match(/filename="(.*?)"/)[1];
    const zipHandle = await fs.open(filename, 'w', 0o644);
    defer(() => zipHandle.close());

    await log(`Downloading ${filename}`);
    await pipeline(response.data, zipHandle.createWriteStream());
  });
}

async function status(uuid) {
  const response = await api.get(`check_files/org_id/${args.org_id}/task_ids/${uuid}`);
  return response.data.shift();
}

function download(uuid, chif) {
  return withDefer(async (defer) => {
    await log(`Downloading ${chif}`);
    let response = await api.get(`download_file/org_id/${args.org_id}/file_entry_id/${uuid}.chif`);

    const outputHandle = await fs.open(chif, 'w', 0o644);
    defer(() => outputHandle.close());

    response = await axios.get(response.data.url, { responseType: 'stream' });
    await pipeline(response.data, outputHandle.createWriteStream());
  });
}

async function block(uuid, code, reason) {
  await log(`Blocking ${uuid}: ${code}: ${reason}`);
  const response = await api.post(`block_file/org_id/${args.org_id}/uuid/${uuid}`, { code, reason });
  return response.data;
}

async function unblock(uuid) {
  await log(`Unblocking ${uuid}`);
  const response = await api.delete(`unblock_file/org_id/${args.org_id}/uuid/${uuid}`);
  return response.data;
}

async function getBlock(uuid) {
  await log(`Getting block for ${uuid}`);
  const response = await api.get(`exception_file/org_id/${args.org_id}/uuid/${uuid}`);
  return response.data;
}

async function getFiles() {
  await log(`Getting files`);
  const response = await api.get(`get_file_entry/org_id/${args.org_id}`);
  console.log(JSON.stringify(response.data, null, '  '));
}

async function del(uuid) {
  await log(`Deleting ${uuid}`);
  const response = await api.delete(`delete_file/org_id/${args.org_id}/file_entry_id/${uuid}`);
  return response.data;
}

async function publish(uuid) {
  await log(`Publishing ${uuid}`);
  const response = await api.post(`publish_file/org_id/${args.org_id}/file_entry_id/${uuid}`);
  return response.data;
}

async function unpublish(uuid) {
  await log(`Unpublishing ${uuid}`);
  const response = await api.delete(`unpublish_file/org_id/${args.org_id}/file_entry_id/${uuid}`);
  return response.data;
}

function wrap(value, fn) {
  return fn(value)
}

async function withDefer(fn) {
  const deferred = [];
  try {
    return await fn((fn) => deferred.unshift(fn));
  } finally {
    for (const fn of deferred) await fn();
  }
}

function sleep(ms) {
  const start = new Date();
  return new Promise((resolve) => setTimeout(() => resolve(new Date() - start), ms));
}
