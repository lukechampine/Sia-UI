ui._hosting = (function(){

    var view, ePropBlueprint, eProps, eControl, eSave, eReset, eAnnounce;


    var hostProperties = [
        {
            "name": "TotalStorage",
            "unit": "GB",
            "conversion": 1/1000000000
        },{
            "name": "MaxFilesize",
            "unit": "MB",
            "conversion": 1/1000000
        },{
            "name": "MaxDuration",
            "unit": "Day",
            "conversion": 1/144
        },{
            "name": "Price",
            "unit": "SC Per GB Per Month",
            "conversion": 4/1000000000000
        }
    ];

    // TODO: don't generate these, just use hostProperties
    var editableProps = hostProperties.map(function(obj){
        return obj["name"];
    });
    var propUnits = hostProperties.map(function(obj){
        return obj["unit"];
    });
    var propConversion = hostProperties.map(function(obj){
        return obj["conversion"];
    });
    var lastHostSettings;

    function init(){

        view = $("#hosting");

        ePropBlueprint = view.find(".property.blueprint");
        eAnnounce = view.find(".announce");
        eControl = view.find(".control");
        eProps = $();
        eSave = view.find(".control .save");
        eReset = view.find(".control .reset");

        addEvents();
    }

    function addEvents(){
        eAnnounce.click(function(){
            ui._trigger("announce-host");
        });
        eSave.click(function(){
            ui._tooltip(this, "Saving");
            ui._trigger("save-host-config", parseHostSettings());
        });
        eReset.click(function(){
            ui._tooltip(this, "Reseting");
            for (var i = 0;i < editableProps.length;i ++){
                var item = $(eProps[i]);
                var value = parseFloat(ui._data.host.HostSettings[editableProps[i]]);
                item.find(".value").text(value * propConversion[i]);
            }
        });
    }

    function parseHostSettings(){
        var newSettings = {};
        for (var i = 0;i < editableProps.length;i ++){
            var item = $(eProps[i]);
            var value = parseFloat(item.find(".value").text());
            newSettings[editableProps[i].toLowerCase()] = value / propConversion[i];
        }
        return newSettings;
    }

    function onViewOpened(data){
        eProps.remove();
        // If this is the first time, create and load all properties
        for (var i = 0; i < editableProps.length; i++){
            var item = ePropBlueprint.clone().removeClass("blueprint");
            ePropBlueprint.parent().append(item);
            eProps = eProps.add(item);
            item.find(".name").text(editableProps[i] + " ("+ propUnits[i] +")");
            var value = parseFloat(data.host.HostSettings[editableProps[i]]);
            item.find(".value").text(value * propConversion[i]);
        }

    }

    return {
        init:init,
        onViewOpened:onViewOpened
    };
})();
