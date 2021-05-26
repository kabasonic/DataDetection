function encodeParity(random_data) {
    var bits_number = random_data.length;
    var bytes_number = bits_number/8;
    bits_number += 1;

    coded_data = new Array(bits_number);
    type = new Array(bits_number);
    initTypes();

    var ileJedynek;

    for(var i=0; i<bytes_number; i++) {
        ileJedynek=0;
        for (var j=0; j<8; j++)
        {
            coded_data[i*9+j+1]=random_data[i*8+j];
            ileJedynek+=random_data[i*8+j];
        }
        if (ileJedynek%2===1) coded_data[i*9]=1;
        else coded_data[i*9]=0;
    }

    return coded_data;
}

function decodeParity() {
    var n = coded_data.length;
    var bytes = n/9;
    dane = new Array(bytes*8);
    var ileJedynek;
    errors=0;
    for (var i=0; i<bytes; i++) {
        ileJedynek=0;
        for (var j=0; j<8; j++) {
            dane[i*8+j] = coded_data[i*9+j+1];
            ileJedynek+=coded_data[i*9+j+1];
        }
        ileJedynek+=coded_data[i*9];
        if (ileJedynek%2==0) {
            type[i*9]=3;
            for (var j=1; j<9; j++) type[i*9+j]=0;
        }
        else
        {
            errors++;
            type[i*9]=5;
            for (var j=1; j<9; j++) type[i*9+j]=2;
        }
    }
}

function fixParity() {
    var n = coded_data.length;
    initTypes();
    var bytes = n/9;
    errors = 0;
    var ileJedynek;

    for (var i = 0; i < bytes; i++) {
        ileJedynek = 0;

        for(var j = 0; j < 8; j++) {
            ileJedynek += coded_data[i*9+j+1];
        }
        ileJedynek+=coded_data[i*9];
        if (ileJedynek%2===0)
        {
                type[i*9]=3;
                for (var j=1; j<9; j++) type[i*9+j]=0;
        }
        else
        {
                errors++;
                type[i*9]=5;
                for (var j=1; j<9; j++) type[i*9+j]=2;
        }
    }
}
