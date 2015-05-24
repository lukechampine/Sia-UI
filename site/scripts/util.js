var util = (function(){

    var pSI = ["", "k", "M", "G", "T"];
    var nSI = ["", "m", "&micro;", "&nano;", "&pico;"];
    var siaConversionFactor = Math.pow(10,24);

    function engNotation(number, precision){
        if (number === 0) return "0.0000 ";
        precision = precision || 8;

        var degree = Math.floor(Math.log(Math.abs(number)) / Math.LN10 / 3);

        var numberString = String(number / Math.pow(1000,degree));

        var si = degree > 0 ? pSI[degree] : nSI[degree * -1];

        return numberString.slice(0,precision + 1) + " " + si;
    }

    function siacoin(mcoin){
        return mcoin / siaConversionFactor;
    }
    function baseUnit(units){
        return units * siaConversionFactor;
    }
    function fsiacoin(mcoin, l){
        if (!l) l = 10;
        var string = parseFloat(siacoin(mcoin).toFixed(1));

        // Indicate if the user has some value with a last digit of '1'
        if (mcoin > 0 && string == parseFloat((0).toFixed(1))){
            string = parseFloat((0).toFixed(l).substring(0,l-1) + "1");
        }
        return string + " SC";
    }

    function USDConvert(balance){
        return balance * 0.0000000172;
    }

    function limitPrecision(number,precision){
        return number.toString().slice(0,precision+1);
    }

    return {
        "engNotation": engNotation,
        "USDConvert": USDConvert,
        "siaConversionFactor": siaConversionFactor,
        "limitPrecision": limitPrecision,
        "siacoin": siacoin,
        "baseUnit": baseUnit,
        "fsiacoin": fsiacoin
    };
})();
