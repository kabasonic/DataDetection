function encodeHamming(random_data) {
    var bits_number = random_data.length;
    var i = 0, redundancy = 0, sum = 0;

    while(i < bits_number) {
        if(Math.pow(2,redundancy) - 1 == sum)
            redundancy++;
        else
            i++;
        sum++;
    }

    coded_data = new Array(sum);
    type = new Array(sum);

    var mask = 0;
    redundancy = 0;
    var d = 0;
    i = 0;
    sum = 0;

    while (i < bits_number) {
        if (Math.pow(2,redundancy) - 1 == sum)
            redundancy++;
        else {
            coded_data[sum]=random_data[i];
            if (random_data[i]==1) mask ^= sum+1;
            i++;
        }
        sum++;
    }

    redundancy = 0;
    for (var i = 0; i < sum; i++) {
        if (Math.pow(2,redundancy) - 1 == i) {
                if ((mask & (1 << redundancy))==0)
                    coded_data[i]=0;
                else
                    coded_data[i]=1;
                redundancy++;
        }
    }

    return coded_data;
}

function decodeHamming() {
    var n = coded_data.length;
    var d = 0;
    var redundancy = 0;

    for (var i = 0; i < n; i++)
    {
        if (Math.pow(2,redundancy) - 1 != i)
            d++;
        else
            redundancy++;
    }

    dane = new Array(d);
    d = 0;
    redundancy = 0;

    for (var i=0; i < n; i++)
    {
        if (Math.pow(2,redundancy) - 1 != i)
        {
                dane[d] = coded_data[i];
                d++;
        }
        else redundancy++;
    }
}

function fixHamming() {
    var n = coded_data.length;
    decoded_data = new Array(n);
    var d = 0;
    var redundancy = 0;
    errors = 0;


    decoded_data = coded_data.slice();
    for (var i = 0; i < n; i++)
    {
        if (Math.pow(2,redundancy)-1 != i)
            d++;
        else
            redundancy++;
    }

    dane = new Array(d);

    var mask = 0;
    d = 0;
    redundancy = 0;

    for (var i = 0; i < n; i++) {
        if (decoded_data[i] == 1)
            mask ^= i+1;

        if (Math.pow(2,redundancy)-1 != i)
        {
            d++;
            type[i]=0;
        }
        else
        {
            type[i]=3;
            redundancy++;
        }
    }

    if (mask != 0)
    {
        errors++;
        var nr = mask - 1;

        if (nr < decoded_data.length)
        {
                if (type[nr]==0)
                    type[nr]=1;
                else if (type[nr]==3)
                    type[nr]=4;

                if (decoded_data[nr]==1)
                    decoded_data[nr]=0;
                else
                    decoded_data[nr]=1;
        }
    }
}
