ui._transferFunds = ui["_transfer-funds"] = (function(){

    var view, fAccountTransfer, fAccountFinalBalance, eAccountBalance, fAddressAddress,
        accountBalance, accountName, transferFromType, transferToType, eSummaryAmount,
        eSummaryFrom, eSummaryTo, eSendMoney, eBack;

    var numberPrecision = 9;

    function init(){

        // Get all the elements
        view = $("#transfer-funds");
        eAccountBalance = view.find(".account .current-balance .amt");
        fAccountTransfer = ui.FieldElement(view.find(".account .field-transfer"));
        fAccountFinalBalance = ui.FieldElement(view.find(".account .field-final-balance"));
        fAddressAddress = ui.FieldElement(view.find(".address .field-address"));
        eSummaryAmount = view.find(".summary .amt");
        eSummaryFrom = view.find(".summary .from");
        eSummaryTo = view.find(".summary .to");
        eSendMoney = view.find(".send-money");
        eBack = view.find(".back.button");

        addEvents();
    }

    function addEvents(){
        fAccountTransfer.setOnChangeListener(function(val){
            var finalBalance = accountBalance - parseFloat(val);

            fAccountFinalBalance.setValue(util.limitPrecision(finalBalance,numberPrecision));

            eSummaryAmount.text(val + " KS");

        });

        fAccountFinalBalance.setOnChangeListener(function(val){

            var transferAmount = accountBalance - parseFloat(val);

            fAccountTransfer.setValue(util.limitPrecision(transferAmount,numberPrecision))

            eSummaryAmount.text(transferAmount + " KS");

        });

        fAddressAddress.setOnChangeListener(function(val){
            eSummaryTo.text(val.slice(0,12) + "...");
        });
        eBack.click(function(){
            ui.switchView("manage-account");
        });

        eSendMoney.click(function(e){
            //TODO: validate inputs
            ui._trigger("send-money", {
                "from": {
                    "type": transferFromType,
                    "amount": util.baseUnit(parseFloat(fAccountTransfer.getValue()))
                },
                "to": {
                    "type": transferToType,
                    "address": fAddressAddress.getValue()
                }
            });
        });
    }

    function onViewOpened(data){

        if (transferFromType == "account"){
            // Find account balance
            accountBalance = null;
            for (var i = 0;i < data.wallet.Accounts.length;i++){
                console.log(data.wallet.Accounts[i], accountName);
                if (data.wallet.Accounts[i].Name == accountName){
                    accountBalance = util.siacoin(data.wallet.Accounts[i].Balance);
                }
            }

            if (accountBalance === null){
                console.error("Could not find account \"" + accountName + "\"");
                return;
            }

            fAccountTransfer.setValue("0.0000");
            fAccountTransfer.triggerChange();
            eAccountBalance.html(util.limitPrecision(accountBalance,numberPrecision) + "&nbsp;");
            eSummaryFrom.text(accountName);
            fAccountTransfer.triggerChange();
        }

        if (transferToType == "address"){
            fAddressAddress.setValue("");
            fAddressAddress.triggerChange();
        }

    }

    // Sets where funds should be coming out of
    function setFrom(type, info){
        transferFromType = type;
        if (type == "account"){
            accountName = info;
        }
    }

    // Sets where funds should be going to
    function setTo(type, info){
        transferToType = type;
    }

    return {
        init:init,
        onViewOpened: onViewOpened,
        setFrom: setFrom,
        setTo: setTo
    };
})();
