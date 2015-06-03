// Utility file to provide math functions

var util = (function(){

    var pSI = ["", "k", "M", "G", "T"];
    var nSI = ["", "m", "&micro;", "&nano;", "&pico;"];
    var siaConversionFactor = Math.pow(10,24);

    // Siacoin to USD
    function USDConvert(balance){
        return balance * 0.0000000172;
    }

    // base units to siacoin
    function siacoin(mcoin){
        return mcoin / siaConversionFactor;
    }

    // siacoin to base units
    function baseUnit(units){
        return units * siaConversionFactor;
    }

    // base units & precision to siacoin
    function fsiacoin(mcoin, l){
        if (!l) l = 10;
        var string = parseFloat(siacoin(mcoin).toFixed(1));

        // Indicate if the user has some value with a last digit of '1'
        if (mcoin > 0 && string == parseFloat((0).toFixed(1))){
            string = parseFloat((0).toFixed(l).substring(0,l-1) + "1");
        }
        return string + " SC";
    }

    // precision determines the length of number
    function limitPrecision(number, precision){
        return number.toString().slice(0,precision+1);
    }

    // engineering notation
    function engNotation(number, precision){
        if (number === 0) return "0.0000 ";
        precision = precision || 8;

        var degree = Math.floor(Math.log(Math.abs(number)) / Math.LN10 / 3);

        var numberString = String(number / Math.pow(1000,degree));

        var si = degree > 0 ? pSI[degree] : nSI[degree * -1];

        return numberString.slice(0,precision + 1) + " " + si;
    }

    // precision determines the length of number
    function round(number, flex){
        if (!flex) flex = .01;
        if (Math.ceil(number) - number <= flex)
            return Math.ceil(number);
        else if (number - Math.floor(number) <= flex)
            return Math.floor(number);
    }

    // properly controls data size representation
    function formatBytes(bytes) {
        if (bytes == 0) return '0B';
        var k = 1000;
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor((Math.log(bytes) + 1) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
    }

    return {
        "USDConvert": USDConvert,
        "siaConversionFactor": siaConversionFactor,
        "siacoin": siacoin,
        "baseUnit": baseUnit,
        "fsiacoin": fsiacoin,
        "limitPrecision": limitPrecision,
        "engNotation": engNotation,
        "round": round,
        "formatBytes": formatBytes
    };
})();
