ui._mining = (function(){

    var view, eMiningStatus, eIncomeRate, eActiveMiners, eActiveMinerCount, eAddMiner,
        eRemoveMiner, eToggleMining, eAccountName, eBalance;

    function init(){
        view = $("#mining");
        eMiningStatus = view.find(".mining-status");
        eIncomeRate = view.find(".income-rate");
        eActiveMiners = view.find(".active-miners");
        eActiveMinerCount = view.find(".miner-control .display .number");
		eBlocksFound = view.find(".blocks-found");
		eBPW = view.find(".blocks-per-week")
        eAddMiner = view.find(".add-miner");
        eRemoveMiner = view.find(".remove-miner");
        eToggleMining = view.find(".toggle-mining");
        eAccountName = view.find(".account-name");
        eBalance = view.find(".account-info .amt");

        addEvents();
    }

    function addEvents(){
        eMiningStatus.click(function(){
            ui._tooltip(eMiningStatus, "Toggling Mining");
            ui._trigger("toggle-mining");
        });
        eAddMiner.click(function(){
            ui._tooltip(this, "Adding Miner");
            ui._trigger("add-miner");
        });
        eRemoveMiner.click(function(){
            ui._tooltip(this, "Removing Miner");
            ui._trigger("remove-miner");
        });
        eToggleMining.click(function(){
            if (eToggleMining.find(".text").text() == "Stop Mining"){
                ui._tooltip(this, "Stopping Miners");
            }else{
                ui._tooltip(this, "Starting Miners");
            }
            ui._trigger("toggle-mining");
        });
    }

    function update(data){
        var minerOn = data.miner.State == "Off" ? false : true;
        if (data.miner.Threads < 1){
            minerOn = false;
        }

        if (!minerOn){
            eMiningStatus.text("Mining Off");
            eMiningStatus.removeClass("enabled");
            eMiningStatus.addClass("disabled");
			eBPW.text(data.miner.BlocksPerWeek + " Blocks/Week");
            eActiveMiners.text("No Active Threads");
            eBlocksFound.text(data.miner.BlocksMined + " Blocks Mined");
            eToggleMining.find(".fa-remove").hide();
            eToggleMining.find(".fa-legal").show();
            eToggleMining.find(".text").text("Start Mining");
        }else{
            eMiningStatus.text((data.miner.HashRate/1000).toFixed(0) + " Khash/s");
            eMiningStatus.removeClass("disabled");
            eMiningStatus.addClass("enabled");
			eBPW.text(data.miner.BlocksPerWeek.toFixed(1) + " Blocks/Week");
            eActiveMiners.text(data.miner.RunningThreads + " Threads");
            eBlocksFound.text(data.miner.BlocksMined + " Blocks Mined");
            eToggleMining.find(".fa-remove").show();
            eToggleMining.find(".fa-legal").hide();
            eToggleMining.find(".text").text("Stop Mining");
        }

        eActiveMinerCount.text(data.miner.RunningThreads);
        //eIncomeRate.html(util.fsiacoin(data.miner.IncomeRate, 20) + "/s"); RELEASE HOTFIX 5.6.15

        eAccountName.text(data.miner.AccountName);

        eBalance.text(util.fsiacoin(data.miner.Balance));

    }

    return {
        init:init,
        update:update
    };
})();
