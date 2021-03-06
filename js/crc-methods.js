var klucz = 0x18005;
var keyLength = 16;

function xor(a, b) {
    if(a == b)
        return 0;
    else
        return 1;
}

function initTable(table) {
    for(var i = 0; i < table.length; i++)
        table[i] = 0;
    return table;
}

function arrayCopy(src_table, src_start, dest_table, dest_start, length) {
    for(var i = 0; i < length; i++) {
        dest_table[dest_start + i] = src_table[src_start + i];
    }

    return dest_table;
}

function countCRC(bits) {
    var n = bits.length;
    var debug= '';
    var crc = new Array(keyLength);
    var temp = new Array(n+keyLength);
    initTable(temp);
    initTable(crc);
    temp = arrayCopy(bits, 0, temp, keyLength, n);
    var tklucz = new Array(keyLength + 1);
    for (var i=0; i<keyLength+1; i++)
    {
        debug += klucz&(1<<i) + '\n';
        if ((klucz&(1<<i))==0) tklucz[i]=0; // ok
        else tklucz[i]=1;
    }

    for (var start=n+keyLength-1; start>keyLength-1; start--)
    {
        if (temp[start]==1)
        {
            for (var i=0; i<keyLength+1; i++)
            {
                temp[start-i]=xor(temp[start-i], tklucz[keyLength-i]);
            }
        }
    }

    crc = arrayCopy(temp, 0, crc, 0, keyLength);

    return crc;
}

function encodeCRC(random_data) {
    var n = random_data.length;
    var l = n+keyLength;
    coded_data = new Array(l);
    type = new Array(l);
    coded_data = initTable(coded_data);
    coded_data = arrayCopy(random_data, 0, coded_data, keyLength, n);
    var crc = countCRC(random_data);
    arrayCopy(crc, 0, coded_data, 0, keyLength);
    for (var i=0; i<keyLength; i++) type[i] = 3;
    for (var i=keyLength; i<l; i++) type[i] = 0;

    return coded_data;
}

function decodeCRC() {
    var l = coded_data.length;
    var n = l-keyLength;
    dane = new Array(n);
    for (var i=0; i<n; i++) dane[i] = coded_data[i+keyLength];
}

function fixCRC() {
    errors = 0;
    var l = coded_data.length;
    type = new Array(l);
    var crc = countCRC(coded_data);
    var ok = true;
    for (var i=0; i<keyLength && ok; i++) if (crc[i]!=0) ok = false;
    if (ok)
    {
        for (var i=0; i<keyLength; i++) type[i] = 3;
        for (var i=keyLength; i<l; i++) type[i] = 0;
    }
    else
    {
        errors++;
        for (var i=0; i<keyLength; i++) type[i] = 5;
        for (var i=keyLength; i<l; i++) type[i] = 2;
    }
}
