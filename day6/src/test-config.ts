import { config } from './config';

console.log('Port:', config.port);
console.log('DB Host:', config.db.host);
console.log('DB Name:', config.db.name);
console.log('Uploads path:', config.paths.uploads);