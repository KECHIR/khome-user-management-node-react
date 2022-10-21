import { ObjectId } from 'mongodb';

export const toOid = (strId) => new ObjectId(strId); // string to objectId

export const isStrOid = (strid) => strid.length === 24;

export const emptyObject = (obj) => Object.keys(obj).length === 0;

