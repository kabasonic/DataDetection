angular.module('APP', [])
    .controller('Controller', ControllerFunction);

function ControllerFunction($scope) {

    $scope.transmitter_bits_number = 8;
    $scope.receiver_bits_number = 1;
    $scope.method = 'parity';
    $scope.bits_errors = '';

    $scope.generateRandomData = function () {
        $scope.clearWhileChangingMethod();
        var random_data_array = prepareRandomData($scope.transmitter_bits_number);
        $scope.transmitter_random_data = arrayToString(random_data_array);
    };

    $scope.checkBitsNumber = function () {
        if ($scope.transmitter_bits_number % 8 != 0 || $scope.transmitter_bits_number == null) {
            $scope.bits_errors = 'Liczba bitów powinna być podzielna przez 8.';
            return false;
        }
        else {
            $scope.bits_errors = '';
            return true;
        }
    };

    $scope.checkBitsNumberFromInput = function () {
        if ($scope.transmitter_random_data) {
            if ($scope.transmitter_random_data.length % 8 != 0 || $scope.transmitter_random_data == '') {
                $scope.clearWhileChangingMethod();
                $scope.input_errors = 'Liczba bitów powinna być podzielna przez 8.';
                return false;
            }
            else {
                $scope.input_errors = '';
                return true;
            }
        } else {
            return false;
        }
    };

    $scope.encodeData = function () {
        var random_data_array = stringToArray($scope.transmitter_random_data);
        var encoded_data_array;
        switch ($scope.method) {
            case 'parity':
                encoded_data_array = encodeParity(random_data_array);
                break;
            case 'hamming':
                encoded_data_array = encodeHamming(random_data_array);
                break;
            case 'crc':
                encoded_data_array = encodeCRC(random_data_array);
                break;
            default:
                alert('encode: nieznana metoda');
        }
        $scope.transmitter_encoded_data = arrayToString(encoded_data_array);
        $scope.encoded_data_array = encoded_data_array;
    };

    $scope.interfereEncodedData = function () {
        var bits_to_negate = $scope.receiver_bits_number;
        interfereData(bits_to_negate);
        $scope.clearWhileInterferencing();
    };

    $scope.manualInterference = function (id) {
        negateBit(id);
        $scope.clearWhileInterferencing();
    };

    $scope.getClass = function (id) {
        var types = getTypesArray();
        switch (types[id]) {
            case 0:
                return "correct";
            case 1:
                return "incorrect";
            case 2:
                return "uncertain";
            case 3:
                return "correct-redundant";
            case 4:
                return "incorrect-redundant";
            case 5:
                return "uncertain-redundant";
            default:
                return "default-type";
        }
    };

    $scope.decodeData = function () {
        initErrors();
        var errors = checkErrors($scope.transmitter_encoded_data, arrayToString($scope.encoded_data_array));

        switch ($scope.method) {
            case 'parity':
                fixParity();
                break;
            case 'hamming':
                fixHamming();
                break;
            case 'crc':
                fixCRC();
                break;
            default:
                alert('fix: nieznana metoda');
        }

        if ($scope.method == 'parity' || $scope.method == 'crc')
            $scope.decoded_data_array = getEncodedData();
        else
            $scope.decoded_data_array = getDecodedData();

        switch ($scope.method) {
            case 'parity':
                decodeParity();
                break;
            case 'hamming':
                decodeHamming();
                break;
            case 'crc':
                decodeCRC();
                break;
            default:
                alert('decode: nieznana metoda');
        }

        $scope.receiver_random_data = arrayToString(getDane());
        $scope.transferred_data_bits = getDane().length;
        $scope.redundant_data_bits = getRedundantBitsNumber();
        $scope.detected_errors = getErrorsNumber();
        $scope.fixed_errors = getFixedErrorsNumber();
        $scope.undetected_errors = errors - getErrorsNumber();
    };

    $scope.updateTypesArrayView = function () {
        $scope.types_array = arrayToString(getTypesArray());
    };

    $scope.updateCodedDataArrayView = function () {
        $scope.coded_data_array = arrayToString(getEncodedData());
    };

    $scope.clearSummary = function () {
        $scope.transferred_data_bits = '';
        $scope.redundant_data_bits = '';
        $scope.detected_errors = '';
        $scope.fixed_errors = '';
        $scope.undetected_errors = '';
    };

    $scope.clearEncodedData = function () {
        $scope.transmitter_encoded_data = '';
        $scope.encoded_data_array = new Array();
        $scope.decoded_data_array = new Array();
    }

    $scope.clearWhileInterferencing = function () {
        $scope.decoded_data_array = new Array();
        $scope.receiver_random_data = '';
        $scope.clearSummary();
    }

    $scope.clearWhileChangingMethod = function () {
        $scope.clearEncodedData();
        $scope.receiver_bits_number = 1;
        $scope.receiver_random_data = '';
        $scope.clearSummary();
    }

    $scope.reset = function () {
        $scope.transmitter_random_data = null;
        $scope.clearWhileChangingMethod();
    };

    $scope.comments = [
        { classname: 'correct', meaning: 'poprawny bit danych' },
        { classname: 'incorrect', meaning: 'przekłamany bit danych' },
        { classname: 'uncertain', meaning: 'niepewny bit danych' },
        { classname: 'correct-redundant', meaning: 'poprawny bit redundantny' },
        { classname: 'incorrect-redundant', meaning: 'przekłamany bit redundantny' },
        { classname: 'uncertain-redundant', meaning: 'niepewny bit redundantny' }
    ];
}

