import chai = require('chai');

import { deserialize, Serializable, serialize } from '../..';

const { expect } = chai;

describe('default type serializer', () => {

    describe('for boolean properties', () => {

        class Book {
            @Serializable.Prop() public read: boolean;
        }

        describe('when the value is a boolean', () => {

            describe('of primitive type', () => {

                it('serializes to a boolean primitive', () => {
                    const book = Object.assign(new Book(), { read: true });
                    const serialized = serialize(book);
                    expect(serialized).to.deep.equal({ read: true });
                });

                it('deserializes to a boolean primitive', () => {
                    const deserialized = deserialize(Book, { read: false });
                    expect(deserialized instanceof Book).to.equal(true);
                    expect(deserialized).to.deep.equal({ read: false });
                });

            });

            describe('of object type', () => {

                it('serializes to a boolean primitive', () => {
                    const book = Object.assign(new Book(), { read: new Boolean(true) });
                    const serialized = serialize(book);
                    expect(serialized).to.deep.equal({ read: true });
                });

                it('deserializes to a boolean primitive', () => {
                    const deserialized = deserialize(Book, { read: new Boolean(false) as boolean });
                    expect(deserialized instanceof Book).to.equal(true);
                    expect(deserialized).to.deep.equal({ read: false });
                });

            });

        });

        describe('when the value is a non-boolean', () => {

            it('should fail to serialize', () => {
                const book = Object.assign(new Book(), { read: new Date() });
                expect(() => serialize(book)).to.throw('Unable to serialize property "read": Not a boolean');
            });

            it('should fail to deserialize', () => {
                expect(() => deserialize(Book, { read: new Date() as any })).to.throw('Unable to deserialize property "read": Not a boolean');
            });

        });

    });

    describe('for number properties', () => {});

    describe('for string properties', () => {

        class Greeter {
            @Serializable.Prop() public message: string;
        }

        describe('when the value is a string', () => {

            describe('of primitive type', () => {

                it('serializes to a string literal', () => {
                    const greeter = Object.assign(new Greeter(), { message: 'hello' });
                    const serialized = serialize(greeter);
                    expect(serialized).to.deep.equal({ message: 'hello' });
                });

                it('deserializes to a string literal', () => {
                    const deserialized = deserialize(Greeter, { message: 'hi' });
                    expect(deserialized instanceof Greeter).to.equal(true);
                    expect(deserialized).to.deep.equal({ message: 'hi' });
                });

            });

            describe('of object type', () => {

                it('serializes to a string literal', () => {
                    const greeter = Object.assign(new Greeter(), { message: new String('hello') });
                    const serialized = serialize(greeter);
                    expect(serialized).to.deep.equal({ message: 'hello' });
                });

                it('deserializes to a string literal', () => {
                    const deserialized = deserialize(Greeter, { message: new String('hello') as string });
                    expect(deserialized instanceof Greeter).to.equal(true);
                    expect(deserialized).to.deep.equal({ message: 'hello' });
                });

            });

        });

        describe('when the value is a non-string', () => {

            it('should fail to serialize', () => {
                const greeter = Object.assign(new Greeter(), { message: new Date() });
                expect(() => serialize(greeter)).to.throw('Unable to serialize property "message": Not a string');
            });

            it('should fail to deserialize', () => {
                expect(() => deserialize(Greeter, { message: new Date() as any })).to.throw('Unable to deserialize property "message": Not a string');
            });

        });

    });

    describe('for Date properties', () => {});

    describe('for RegExp properties', () => {});

});
