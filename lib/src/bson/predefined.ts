import { Constructor, Util } from 'serialazy';

import BsonSerializable from "./bson_serializable";
import { BSONRegExp, Double, Int32 } from './bson_type';

function expectDateOrNil(maybeDate: any): Date {
    if (maybeDate === null || maybeDate === undefined) {
        return maybeDate;
    } else if (!(maybeDate instanceof Date)) {
        throw new Error(`Not a Date (typeof: "${typeof(maybeDate)}", value: "${maybeDate}")`);
    } else {
        return maybeDate;
    }
}

// *** Declare pre-defined serializers ***

BsonSerializable.Type<boolean, boolean>({
    down: (original: any) => Util.expectBooleanOrNil(original),
    up: (serialized: any) => Util.expectBooleanOrNil(serialized)
})(Boolean as any as Constructor<boolean>);

BsonSerializable.Type<Double | Int32, number>({
    down: (original: any) => {
        const num = Util.expectNumberOrNil(original);
        if (num === null || num === undefined) {
            return num as null | undefined;
        } else if (Number.isInteger(num)) {
            return new Int32(num);
        } else {
            return new Double(num);
        }
    },
    up: (serialized: any) => {
        if (serialized === null || serialized === undefined) {
            return serialized as null | undefined;
        } else if (serialized._bsontype === 'Double' || serialized._bsontype === 'Int32') {
            const num = serialized.valueOf && serialized.valueOf();
            if (typeof num === 'number') {
                return num;
            }
        }
        throw new Error(`Not a Double/Int32 BSON type (typeof: "${typeof(serialized)}", value: "${serialized}")`);
    }
})(Number as any as Constructor<number>);

BsonSerializable.Type<string, string>({
    down: (original: any) => Util.expectStringOrNil(original),
    up: (serialized: any) => Util.expectStringOrNil(serialized)
})(String as any as Constructor<string>);

BsonSerializable.Type<Date, Date>({
    down: (original: any) => expectDateOrNil(original),
    up: (serialized: any) => expectDateOrNil(serialized)
})(Date);

BsonSerializable.Type<BSONRegExp, RegExp>({
    down: (original: any) => {
        if (original === null || original === undefined) {
            return original as null | undefined;
        } else if (!(original instanceof RegExp)) {
            throw new Error(`Not a RegExp (typeof: "${typeof(original)}", value: "${original}")`);
        } else {
            return new BSONRegExp(original.source, original.flags);
        }
    },
    up: (serialized: any) => {
        if (serialized === null || serialized === undefined) {
            return serialized as null | undefined;
        } else if (serialized._bsontype = 'BSONRegExp') {
            return new RegExp(serialized.pattern, serialized.options);
        } else {
            throw new Error(`Not a BSONRegExp (typeof: "${typeof(serialized)}", value: "${serialized}")`);
        }
    }
})(RegExp);
