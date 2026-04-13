import bus from './bus.js';
import './logger.js';

bus.emit('import.started', {file: 'data.csv'});

bus.emit('import.rowAccepted', {row: 1, name: 'Alice'});
bus.emit('import.rowRejected', {row:2, reason: 'missing email'});
bus.emit('import.rowAccepted', {row:3, name: 'Bob'})

bus.emit('import.finished', {total: 3,accepted: 2, rejected: 1});