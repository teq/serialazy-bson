import { Constructor, TypeSerializer } from 'serialazy';
import BsonType from "./bson_type";

type BsonTypeSerializer<TOriginal> = TypeSerializer<BsonType, TOriginal>;

namespace BsonTypeSerializer {

    const picker = new TypeSerializer.Picker<BsonType>('bson', [
        // new JsonBooleanTypeSerializer(),
        // new JsonNumberTypeSerializer(),
        // new JsonStringTypeSerializer()
    ]);

    export const pickForValue = (value: any) => picker.pickForValue(value);
    export const pickForType = (type: Constructor<any>) => picker.pickForType(type);
    export const pickForProp = (proto: Object, propertyName: string) => picker.pickForProp(proto, propertyName);

}

export default BsonTypeSerializer;
