let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_22(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h35b789309903b8ca(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_25(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures__invoke0_mut__h30d4e4bc6f0ee9eb(arg0, arg1);
}

function __wbg_adapter_28(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h2b06220ad61007bb(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_35(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hf299729373c72b5c(arg0, arg1);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function __wbg_adapter_106(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h2770653243ea8522(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
export class Client {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Client.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_client_free(ptr);
    }
    /**
    * Creates an offline client from the metadata bytes and the name of the metadata file.
    *
    * genesis_hash and runtime_version are set to some unimportant default values and hopefully not used.
    * @param {string} metadata_file_name
    * @param {Uint8Array} bytes
    * @returns {Client}
    */
    static fromBytes(metadata_file_name, bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(metadata_file_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.client_fromBytes(retptr, ptr0, len0, addHeapObject(bytes));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Client.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Creates an OnlineClient from a given url
    * @param {string} url
    * @returns {Promise<Client>}
    */
    static fromUrl(url) {
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.client_fromUrl(ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @returns {any}
    */
    metadataContent() {
        const ret = wasm.client_metadataContent(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @param {string} pallet_name
    * @returns {any}
    */
    palletDocs(pallet_name) {
        const ptr0 = passStringToWasm0(pallet_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.client_palletDocs(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {string} pallet_name
    * @returns {any}
    */
    palletContent(pallet_name) {
        const ptr0 = passStringToWasm0(pallet_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.client_palletContent(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {string} pallet_name
    * @param {string} call_name
    * @returns {any}
    */
    callContent(pallet_name, call_name) {
        const ptr0 = passStringToWasm0(pallet_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(call_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.client_callContent(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} pallet_name
    * @param {string} entry_name
    * @returns {any}
    */
    storageEntryContent(pallet_name, entry_name) {
        const ptr0 = passStringToWasm0(pallet_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(entry_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.client_storageEntryContent(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} pallet_name
    * @param {string} constant_name
    * @returns {any}
    */
    constantContent(pallet_name, constant_name) {
        const ptr0 = passStringToWasm0(pallet_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(constant_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.client_constantContent(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} runtime_api_trait_name
    * @returns {any}
    */
    runtimeApiTraitDocs(runtime_api_trait_name) {
        const ptr0 = passStringToWasm0(runtime_api_trait_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.client_runtimeApiTraitDocs(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {string} runtime_api_trait_name
    * @returns {any}
    */
    runtimeApiTraitContent(runtime_api_trait_name) {
        const ptr0 = passStringToWasm0(runtime_api_trait_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.client_runtimeApiTraitContent(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {string} runtime_api_trait_name
    * @param {string} method_name
    * @returns {any}
    */
    runtimeApiMethodContent(runtime_api_trait_name, method_name) {
        const ptr0 = passStringToWasm0(runtime_api_trait_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(method_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.client_runtimeApiMethodContent(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * Dynamically fetches the value of a keyless storage entry.
    * Only works if this is an online client.
    * @param {string} pallet_name
    * @param {string} entry_name
    * @returns {Promise<any>}
    */
    fetchKeylessStorageValue(pallet_name, entry_name) {
        const ptr0 = passStringToWasm0(pallet_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(entry_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.client_fetchKeylessStorageValue(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
}

export function __wbg_client_new(arg0) {
    const ret = Client.__wrap(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbg_log_38051ba3519d4c93(arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_cb_drop(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

export function __wbg_set_841ac57cff3d672b(arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
};

export function __wbg_clearTimeout_76877dbc010e786d(arg0) {
    const ret = clearTimeout(takeObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_setTimeout_75cb9b6991a4031d() { return handleError(function (arg0, arg1) {
    const ret = setTimeout(getObject(arg0), arg1);
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_string(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

export function __wbg_wasClean_74cf0c4d617e8bf5(arg0) {
    const ret = getObject(arg0).wasClean;
    return ret;
};

export function __wbg_code_858da7147ef5fb52(arg0) {
    const ret = getObject(arg0).code;
    return ret;
};

export function __wbg_reason_cab9df8d5ef57aa2(arg0, arg1) {
    const ret = getObject(arg1).reason;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

export function __wbg_newwitheventinitdict_1f554ee93659ab92() { return handleError(function (arg0, arg1, arg2) {
    const ret = new CloseEvent(getStringFromWasm0(arg0, arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_addEventListener_5651108fc3ffeb6e() { return handleError(function (arg0, arg1, arg2, arg3) {
    getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
}, arguments) };

export function __wbg_addEventListener_a5963e26cd7b176b() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
}, arguments) };

export function __wbg_dispatchEvent_a622a6455be582eb() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).dispatchEvent(getObject(arg1));
    return ret;
}, arguments) };

export function __wbg_removeEventListener_5de660c02ed784e4() { return handleError(function (arg0, arg1, arg2, arg3) {
    getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
}, arguments) };

export function __wbg_readyState_b25418fd198bf715(arg0) {
    const ret = getObject(arg0).readyState;
    return ret;
};

export function __wbg_setbinaryType_096c70c4a9d97499(arg0, arg1) {
    getObject(arg0).binaryType = takeObject(arg1);
};

export function __wbg_new_b66404b6322c59bf() { return handleError(function (arg0, arg1) {
    const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_close_dfa389d8fddb52fc() { return handleError(function (arg0) {
    getObject(arg0).close();
}, arguments) };

export function __wbg_send_280c8ab5d0df82de() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).send(getStringFromWasm0(arg1, arg2));
}, arguments) };

export function __wbg_send_1a008ea2eb3a1951() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).send(getArrayU8FromWasm0(arg1, arg2));
}, arguments) };

export function __wbg_data_ab99ae4a2e1e8bc9(arg0) {
    const ret = getObject(arg0).data;
    return addHeapObject(ret);
};

export function __wbg_new_898a68150f225f2e() {
    const ret = new Array();
    return addHeapObject(ret);
};

export function __wbg_new_b51585de1b234aff() {
    const ret = new Object();
    return addHeapObject(ret);
};

export function __wbg_set_502d29070ea18557(arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
};

export function __wbg_instanceof_ArrayBuffer_39ac22089b74fddb(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof ArrayBuffer;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Error_ab19e20608ea43c7(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Error;
    } catch {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_message_48bacc5ea57d74ee(arg0) {
    const ret = getObject(arg0).message;
    return addHeapObject(ret);
};

export function __wbg_name_8f734cbbd6194153(arg0) {
    const ret = getObject(arg0).name;
    return addHeapObject(ret);
};

export function __wbg_toString_1c056108b87ba68b(arg0) {
    const ret = getObject(arg0).toString();
    return addHeapObject(ret);
};

export function __wbg_call_01734de55d61e11d() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_43f1b47c28813cbd(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_106(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_resolve_53698b95aaf7fcf8(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_then_f7e06ee3c11698eb(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_buffer_085ec1f694018c4f(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export function __wbg_new_8125e318e6245eed(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_set_5cf90238115182c3(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export function __wbg_length_72e2208bbc0efc61(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

export function __wbg_set_092e06b0f9d71865() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper5488(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1615, __wbg_adapter_22);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper5535(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1638, __wbg_adapter_25);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper5722(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1711, __wbg_adapter_28);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper5724(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1711, __wbg_adapter_28);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper5726(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1711, __wbg_adapter_28);
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper5728(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 1711, __wbg_adapter_35);
    return addHeapObject(ret);
};

