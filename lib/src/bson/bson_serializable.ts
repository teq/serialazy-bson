import {
  MetadataManager,
  ObjectPropertySerializer,
  TypeSerializer,
  Constructor
} from 'serialazy';

import BsonType from './bson_type';
import BsonTypeSerializer from './bson_type_serializer';

function isTypeSerializer<TSerialized, TOriginal>(target: any): target is TypeSerializer<TSerialized, TOriginal> {
    return typeof target === 'object' && typeof target.down === 'function' && typeof target.up === 'function';
}

namespace BsonSerializable {

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
    ) {

        let customTypeSerializer: TypeSerializer<TSerialized, TOriginal> = null;
        let options: ObjectPropertySerializer.Options = null;

        if (isTypeSerializer(optionsOrCustomTypeSerializer)) {
            customTypeSerializer = optionsOrCustomTypeSerializer;
            options = maybeOptions;
        } else {
            options = optionsOrCustomTypeSerializer;
        }

        return (proto: Object, propertyName: string) => {

            const compiledTypeSerializerProvider = () => {

                try {

                    const defaultTypeSerializer = BsonTypeSerializer.pickForProp(proto, propertyName);

                    if (customTypeSerializer) {
                        return TypeSerializer.compile([defaultTypeSerializer, customTypeSerializer]);
                    } else {
                        return TypeSerializer.compile([defaultTypeSerializer]);
                    }

                } catch (error) {
                    const className = proto.constructor.name;
                    throw new Error(`Unable to construct a type serializer for property "${className}.${propertyName}": ${error.message}`);
                }

            };

            const propertySerializer = new ObjectPropertySerializer(propertyName, compiledTypeSerializerProvider, options);
            MetadataManager.get('bson').getOrCreatePropertyBagMetaFor(proto).setPropertySerializer(propertyName, propertySerializer);

        };

    }

    /** Use custom BSON serializer for given type */
    export function Type<TSerialized extends BsonType, TOriginal>(
        customTypeSerializer: TypeSerializer<TSerialized, TOriginal>,
    ) {
        return (ctor: Constructor<TOriginal>) => {
            const customTypeSerializerProvider = () => customTypeSerializer;
            const proto = ctor.prototype;
            MetadataManager.get('bson').getOrCreateCustomTypeMetaFor(proto).setTypeSerializer(customTypeSerializerProvider);
        };
    }

}

export default BsonSerializable;
