import makeError from 'make-error';

const AlreadyBuffering = makeError('AlreadyBuffering');
const NotBuffering = makeError('NotBuffering');
const IllegalAdd = makeError('IllegalAdd');
const DuplicateEntry = makeError('DuplicateEntry');
const NoSuchEntry = makeError('NoSuchEntry');

class Collection {
	
	constructor () {

		this._map = {};
		this._buffering = false;
		this._size = 0;

	}

	_initBuffer () {

		this._buffer = {
			remove: [],
			add: [],
			update: []
		};

	}

	bufferChanges (state = true) {

		if (state && this._buffer) {
			throw new AlreadyBuffering('Already buffering'); // FIXME Really ?...
		}
		if (!state && !this._buffer) {
			throw new NotBuffering('Not buffering'); // FIXME Really ?...
		}
		this._buffer = state;

		if (!this._buffer) {
			this._initBuffer();
		}

	}

	flush () {

		if (!this._buffer) {
			throw new NotBuffering('NothingToFlush');
		}

		this._buffering = false; // FIXME Really ?

		// TODO Throws buffered events

		this._initBuffer();

	}

	_touch (key, action) {

		// TODO Buffers changes or throws an event

	}

	_set (key, value) {

		this._map[key] = value;
		this._touch(key, 'update');
		return this;

	}

	_unset (key) {

		delete this._map[key];
		this._touch(key, 'remove');
		return this;
	}

	getId (item) {
		return item.id;
	}

	has (key) {

		return this._map.hasOwnProperty(key);

	}

	resolveEntry (keyOrObjectWithId, valueIfKey = null) {

		let value;
		let key = (undefined !== keyOrObjectWithId) ?
			this.getId(keyOrObjectWithId) :
			undefined;

		if (undefined === key) {
			if (arguments.length < 2) {
				throw new IllegalAdd();
			} else {
				key = keyOrObjectWithId;
				value = valueIfKey;
			}
		} else {
			value = keyOrObjectWithId;
		}

		return [key, value];
	}

	_assertHas(key) {

		if (!this.has(key)) {
			throw new NoSuchEntry();
		}

	}

	_assertNotHas(key) {

		if (this.has(key)) {
			throw new DuplicateEntry();
		}

	}

	add (keyOrObjectWithId, valueIfKey = null) {

		const [key, value] = this.resolveEntry.apply(this, arguments);

		this._assertNotHas(key);
		this._size++;

		return this._set(key, value);

	}

	set (keyOrObjectWithId, valueIfKey = null) {

		const [key, value] = this.resolveEntry.apply(this, arguments);

		if (!this.has(key)) {
			this._size++;
		}

		return this._set(key, value);

	}

	get (key) {

		this._assertHas(key);

		return this._map[key];
	}

	update (keyOrObjectWithId, valueIfKey = null) {

		const [key, value] = this.resolveEntry.apply(this, arguments);

		this._assertHas(key);

		return this._set(key, value);

	}

	remove (keyOrObjectWithId) {

		const [key] = this.resolveEntry(keyOrObjectWithId, null);

		this._assertHas(key);
		this._size--;

		return this._unset(key);

	}

	get size () {
		return this._size;
	}

	get all () {
		return this._map;
	}

}

export default {
	Collection,
	AlreadyBuffering,
	NotBuffering,
	IllegalAdd,
	DuplicateEntry,
	NoSuchEntry
};