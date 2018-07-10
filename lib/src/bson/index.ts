import { Constructor } from 'serialazy';

import { BsonType } from './bson_type';
import BsonTypeSerializer from './bson_type_serializer';
import './predefined';

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
      const { down } = BsonTypeSerializer.pickForValue(serializable);
      if (!down) {
          throw new Error(`Unable to serialize a value: ${serializable}`);
      }
      serialized = down(serializable);
  }

  return serialized;

}

/**
* Construct/deserialize a serializable type instance from a BSON object
* @param ctor Serializable type constructor function
* @param serialized BSON object (js-bson)
* @returns Serializable type instance
*/
function deserializeFromBson<T>(ctor: Constructor<T>, serialized: BsonType): T {

  if (typeof(ctor) !== 'function') {
      throw new Error('Expecting a constructor function');
  }

  const { up } = BsonTypeSerializer.pickForType(ctor);

  if (!up) {
      throw new Error(`Unable to deserialize an instance of "${ctor.name}" from: ${serialized}`);
  }

  return up(serialized);

}

// Functions
export {
  serializeToBson,
  serializeToBson as serialize, // alias
  deserializeFromBson,
  deserializeFromBson as deserialize // alias
};

// Decorators
export {
  default as BsonSerializable,
  default as Serializable // alias
} from './bson_serializable';
