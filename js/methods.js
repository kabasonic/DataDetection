var type;
var dane;
var coded_data;
var errors;
var decoded_data;

function getEncodedData() {
    return coded_data;
}

function getDecodedData() {
    return decoded_data;
}

function getTypesArray() {
    return type;
}

function getDane() {
    return dane;
}

function getErrorsNumber() {
    return errors;
}

function initTypes() {
    for(var i = 0; i < type.length; i++)
        type[i] = 0;
}

function prepareRandomData(n) {
    var dane = new Array(n);

    for(var i=0; i<n; i++) {
        dane[i] = Math.floor((Math.random() * 2));
    }

    return dane;
}

function arrayToString(array) {
    var string = "";
    var n = array.length;

    for(var i=0; i<n; i++) {
        if(typeof(array[i]) !== 'undefined' && array[i] !== null) {
            string = string.concat(array[i].toString());
        }
        else { return string; }

    }

    return string;
}

function stringToArray(string) {
    var n = string.length;
    var dane = new Array(n);

    for(var i=0; i<n; i++) {
        dane[i] = parseInt(string[i]);
    }

    return dane;
}

function interfereData(n) {
    var length = coded_data.length;
    if (n > length) n = length;
    var position, interfered_bits = 0;
    initTypes();

    while(interfered_bits < n) {
        position = Math.floor((Math.random() * length));
        if (type[position]==0) {
            if (coded_data[position]==1)
                coded_data[position]=0;
            else
                coded_data[position]=1;

            type[position]=1;
            interfered_bits++;
        }
    }
}

function initErrors() {
    errors = 0;
}

function checkErrors(transmitter_encoded_data, receiver_encoded_data) {
    if(transmitter_encoded_data.length !== receiver_encoded_data.length)
        return -1;
    for(var i = 0; i < transmitter_encoded_data.length; i++) {
        if (transmitter_encoded_data[i] !== receiver_encoded_data[i])
            errors++;
    }
    return errors;
}

function getRedundantBitsNumber() {
    return coded_data.length - dane.length;
}

function getFixedErrorsNumber() {
    var fixed = 0;
    for (var i = 0; i < type.length; i++)
    {
            if (type[i]===1 || type[i]===4) fixed++;
    }
    return fixed;
}

function negateBit(i) {
    if(coded_data[i]==1) coded_data[i]=0;
    else coded_data[i]=1;

    if(type[i]==1) type[i]=0;
    else type[i]=1;
}
