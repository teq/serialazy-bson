import { BSON } from 'bson';
import { Constructor, TypeSerializer } from 'serialazy';

import BsonType from './bson_type';
import './predefined';

const bson = new BSON();
const picker = new TypeSerializer.Picker<BsonType>('bson');

/**
 * Serialize given serializable type instance to a BSON type
 * @param serializable Serializable type instance
 * @returns BSON type (js-bson)
 */
function serializeToBson(serializable: any): BsonType {

    let serialized: BsonType;

    if (serializable === null || serializable === undefined) {
        serialized = serializable;
    } else {
        const { down } = picker.pickForValue(serializable);
        if (!down) {
            throw new Error(`Unable to serialize a value: ${serializable}`);
        }
        serialized = down(serializable);
    }

    return serialized;

}

/**
 * Serialize given serializable type instance to a BSON binary
 * @param serializable Serializable type instance
 * @returns Buffer with BSON binary
 */
function serializeToBsonBinary(serializable: any): Buffer {

    const bsonType = serializeToBson(serializable);

    return bson.serialize(bsonType);

}

/**
 * Construct/deserialize a serializable type instance from a BSON type
 * @param ctor Serializable type constructor function
 * @param serialized BSON object (js-bson)
 * @returns Serializable type instance
 */
function deserializeFromBson<T>(ctor: Constructor<T>, serialized: BsonType): T {

    if (typeof(ctor) !== 'function') {
        throw new Error('Expecting a constructor function');
    }

    const { up } = picker.pickForType(ctor);

    if (!up) {
        throw new Error(`Unable to deserialize an instance of "${ctor.name}" from: ${serialized}`);
    }

    return up(serialized);

}

/**
 * Construct/deserialize a serializable type instance from a BSON binary
 * @param ctor Serializable type constructor function
 * @param serialized Buffer with BSON binary
 * @returns Serializable type instance
 */
function deserializeFromBsonBinary<T>(ctor: Constructor<T>, serialized: Buffer): T {

    const bsonType: BsonType = bson.deserialize(serialized, {
        promoteValues: false,
        promoteLongs: false,
        bsonRegExp: true
    });

    return deserializeFromBson(ctor, bsonType);

}

// Functions
export {
    serializeToBson,
    serializeToBson as serialize, // alias
    serializeToBsonBinary,
    serializeToBsonBinary as serializeToBinary, // alias
    deserializeFromBson,
    deserializeFromBson as deserialize, // alias
    deserializeFromBsonBinary,
    deserializeFromBsonBinary as deserializeFromBinary // alias
};

// Decorators
export {
    default as BsonSerializable,
    default as Serializable // alias
} from './bson_serializable';
