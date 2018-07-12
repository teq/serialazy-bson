import chai = require('chai');

import { Binary, BSON, BSONRegExp, Code, Double, Int32, Long, ObjectID, Timestamp } from 'bson';
import { Serializable, serialize } from '../..';

const { expect } = chai;

describe('bson types', () => {

    it('works', async () => {

        const serializeOptions = { checkKeys: true };
        const deserializeOptions = { bsonRegExp: true, promoteValues: false };

        const bson = new BSON();

        const doc = {
            arrField: [1, 2, 3],
            objField: { ll: Long.fromInt(1) },
            strField: 'hello',
            boolField: true,
            dateField: new Date(),
            longField: Long.fromString('123123'),
            intField: new Int32(100),
            doubleField: new Double(123.123),
            regexField: new BSONRegExp('asd', 'i'),
            codeField: new Code('async () => console.log("test")'),
            tsField: Timestamp.fromNumber(123123123),
            oidField: new ObjectID(),
            binField: new Binary(Buffer.from('365bc517-a75d-4033-b491-d8fd6631a703'), Binary.SUBTYPE_UUID),
        };

        console.debug('!!!DOC', doc);

        const ser = bson.serialize(doc, serializeOptions);

        const des = bson.deserialize(ser, deserializeOptions);

        console.debug('!!!DES', des);

    });

    it('asd', async () => {

        class Book {
            @Serializable.Prop()
            public title: string;
        }

        const book = Object.assign(new Book(), { title: 'Test' });

        const serialized = serialize(book);

    });

});

