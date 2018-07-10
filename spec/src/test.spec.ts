import chai = require('chai');
import { MongoClient } from 'mongodb';

import { Binary, BSON, BSONRegExp, Code, Double, Int32, Long, ObjectID, Timestamp } from 'bson';

const { expect } = chai;

describe('bson types', () => {

    let client: MongoClient;

    before(async () => {
        client = await MongoClient.connect('mongodb://localhost:27017');
    });

    after(async () => {
        await client.close();
    });

    it('works', async () => {

        const serializeOptions = { checkKeys: true };
        const deserializeOptions = { bsonRegExp: true, promoteValues: false };

        const collection = client.db('test').collection('test');

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

        await collection.insertOne(doc);

        const raw = await collection.findOne({}, { raw: true });
        const item = bson.deserialize(raw, deserializeOptions);

        console.debug('!!!ITEM', item);

    });

    it('asd', async () => {

        // class Book {
        //     @MongodbSerializable.Prop()
        //     public title: string;
        // }

    });

});

