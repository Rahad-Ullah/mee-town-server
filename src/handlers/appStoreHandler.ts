import { AppStoreServerAPI, Environment } from 'app-store-server-api';
import fs from 'fs';
import config from '../config';

const privateKey = fs.readFileSync(config.apple.private_key_path!, 'utf8');

const appleApi = new AppStoreServerAPI(
  privateKey,
  config.apple.key_id!,
  config.apple.issuer_id!,
  config.apple.bundle_id!,
  Environment.Sandbox // or Environment.Production
);

export default appleApi;
