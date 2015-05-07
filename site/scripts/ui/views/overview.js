// This module is for interaction with the overview view

ui._overview = (function(){

    var view, eBalance, eBlockHeight;

    function init(){
        view = $("#overview");

        // Dashboard second header
        eBalance = view.find(".balance");

        eBlockHeight = view.find(".blockheight");

        addEvents();
    }

    function addEvents(){

    }

    function update(data){
        // Second Header
        eBalance.html(util.fsiacoin(data.wallet.Balance));
        eBlockHeight.html("Block Height: " + data.consensus.Height);
    }

    return {
        "init": init,
        "update": update
    };

})();
