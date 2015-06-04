ui._manageAccount = ui["_manage-account"] = (function(){

    var view,eBackToMoney, eBalance, eAccountName, eAddFunds, eWithdraw,
        eAddressBlueprint,eAddresses, eCreateAddress, eSendMoney,
        eTransferFunds, eDeleteAccount, eAddressDropdown;

    var accountName;

    function init(){

        view = $("#manage-account");

        eBalance = view.find(".sumdisplay .amt");
        eAccountName = view.find(".account-name");
        eBackToMoney = $("#back-to-money");
        eCreateAddress = view.find(".create-address");
        eSendMoney = view.find(".send-money");
        eTransferFunds = view.find(".transfer-funds");
        eDeleteAccount = view.find(".delete-account");
        eAddressBlueprint = view.find(".addresses .item.blueprint");
        eAddFunds = view.find(".add-funds");
        eWithdraw = view.find(".withdraw");
        eAddressDropdown = view.find(".dropdown-button");
        eAddresses = $();

        addEvents();
    }

    function addEvents(){
        eBackToMoney.click(function(){
            ui.switchView("money");
        });
        eAddFunds.click(function(){
            ui._tooltip(this, "Not Implemented");
        });
        eWithdraw.click(function(){
            ui._tooltip(this, "Not Implemented");
        });
        eCreateAddress.click(function(){
            ui._tooltip(this, "Creating Address");
            ui._trigger("create-address", accountName);
        });
        eSendMoney.click(function(){
            ui._transferFunds.setFrom("account", accountName);
            ui._transferFunds.setTo("address");
            ui.switchView("transfer-funds");
        });
        eTransferFunds.click(function(){
            ui._tooltip(this, "Not Implemented");
        });
        eDeleteAccount.click(function(){
            ui._tooltip(this, "Not Implemented");
        });
        eAddressDropdown.click(function(){
            ui._tooltip(this, "Not Implemented");
        });
    }

    function setAccount(_accountName){
        accountName = _accountName;
        eAccountName.text(accountName);
    }

    function onViewOpened(data){

        if (!accountName){
            setAccount("Default");
        }

        // Find specified account
        var account;
        for (var i = 0;i < data.wallet.Accounts.length;i++){
            if (data.wallet.Accounts[i].Name == accountName){
                account = data.wallet.Accounts[i];
            }
        }

        if (!account){
            // TODO: throw this error again when the polling issue is fixed
            // console.error("Invalid Account");
            return;
        }

        // TODO this balance should represent the account's balance
        eBalance.html(util.fksiacoin(account.Balance));
        eBalance.off("hover");
        eBalance.click(function(){
            ui._tooltip(this, util.fksiacoin(account.Balance), {left:0,top:30});
        });

        // Populate addresses
        eAddresses.remove();
        eAddresses = $();
        var eItems = [];
        for (var i = 0;i < account.Addresses.length;i++){
            var item = eAddressBlueprint.clone().removeClass("blueprint");
            eAddressBlueprint.parent().append(item);
            item.find(".address").text(account.Addresses[i].Address);
            item.find(".amt").text(account.Addresses[i].Balance);
            eItems.push(item[0]);
        }
        eAddresses = $(eItems);
    }

    return {
        init:init,
        setAccount: setAccount,
        onViewOpened:onViewOpened
    };
})();
