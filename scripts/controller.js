var controller = (function(){

    var data = {};

    function init(){
        update();
        addListeners();
        setInterval(function(){
            update();
        },250);
    }

    function addListeners(){
        ui.addListener("add-miner", function(){
            console.log("Getting miner",data.miner.Threads);
            $.get("/miner/start",{
                "threads": data.miner.Threads + 1
            }, function(e){
                // TODO: handle error
                console.log(e);
            });
        });
        ui.addListener("remove-miner", function(){
            console.log("Getting miner",data.miner.Threads);
            $.get("/miner/start",{
                "threads": data.miner.Threads - 1 < 0 ? 0 : data.miner.Threads - 1
            }, function(e){
                // TODO: handle error
                console.log(e);
            });
        });
        ui.addListener("toggle-mining", function(){
            console.log("Toggling miner",data.miner.Threads);
            if (data.miner.State == "Off"){
                $.get("/miner/start",{
                    "threads": data.miner.Threads
                }, function(e){
                    // TODO: handle error
                    console.log(e);
                });
            }else{
                $.get("/miner/stop", function(e){
                    // TODO: handle error
                    console.log(e);
                });
            }
        });
        ui.addListener("stop-mining", function(){
            console.log("Getting miner",data.miner.Threads);
            $.get("/miner/stop", function(e){
                // TODO: handle error
                console.log(e);
            });
        });
    }

    function update(){
        // Get json objects from each source and merge
        $.getJSON("/wallet/status", function(response){
            data.wallet = {
                "Balance": response.Balance,
                "FullBalance": response.FullBalance,
                "USDBalance": util.USDConvert(response.Balance),
                "NumAddresses": response.NumAddresses,
                "DefaultAccount": "Main Account",
                "Accounts": [{
                    "Name" : "Main Account",
                    "Balance": response.Balance,
                    "USDBalance": util.USDConvert(response.Balance),
                    "NumAddresses": response.NumAddresses,
                    "Addresses": [],
                    "Transactions": []
                }]
            };
            updateUI();
        });
        var lastUpdateTime = Date.now();
        var lastBalance = 0;
        $.getJSON("/miner/status", function(response){
            var timeDifference = (Date.now() - lastUpdateTime) * 1000;
            var balance = data.wallet ? data.wallet.Balance : 0;
            var balanceDifference = balance - lastBalance;
            var incomeRate = balanceDifference / timeDifference;
            data.miner = {
                "State": response.State,
                "Threads": response.Threads,
                "RunningThreads": response.RunningThreads,
                "Address": response.Address,
                "AccountName": "Main Account",
                "Balance": balance,
                "USDBalance": util.USDConvert(balance),
                "IncomeRate": incomeRate + " SC/s"
            };
            lastBalance = balance;
            lastUpdateTime = Date.now();
            updateUI();
        });
        $.getJSON("/json/status", function(response){
            data.status = response;
            updateUI();
        });
    }

    function updateUI(){
        if (data.wallet && data.miner && data.status){
            ui.update(data);
        }
    }

    return {
        "init": init,
        "update": update
    };
})();
