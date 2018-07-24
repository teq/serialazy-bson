import {
    Constructor,
    ObjectPropertySerializer,
    ObjectSerializable,
    TypeSerializer
} from 'serialazy';

import BsonType from './bson_type';

namespace BsonSerializable {

    const bsonSerializable = new ObjectSerializable<BsonType>('bson');

    /** Use default BSON type serializer for given property */
    export function Prop(
        options?: ObjectPropertySerializer.Options
    ): (proto: Object, propertyName: string) => void;

    /** Use custom BSON type serializer for given property */
    export function Prop<TSerialized extends BsonType, TOriginal>(
        customTypeSerializer: TypeSerializer<TSerialized, TOriginal>,
        options?: ObjectPropertySerializer.Options
    ): (proto: Object, propertyName: string) => void;

    export function Prop<TSerialized extends BsonType, TOriginal>(
        optionsOrCustomTypeSerializer: ObjectPropertySerializer.Options | TypeSerializer<TSerialized, TOriginal>,
        maybeOptions?: ObjectPropertySerializer.Options
    ): (proto: Object, propertyName: string) => void {
        return bsonSerializable.propertyDecorator(
            optionsOrCustomTypeSerializer as TypeSerializer<TSerialized, TOriginal>,
            maybeOptions as ObjectPropertySerializer.Options
        );
    }

    /** Use custom BSON serializer for given type */
    export function Type<TSerialized extends BsonType, TOriginal>(
        customTypeSerializer: TypeSerializer<TSerialized, TOriginal>,
    ): (ctor: Constructor<TOriginal>) => void {
        return bsonSerializable.typeDecorator(customTypeSerializer);
    }

}

export default BsonSerializable;
