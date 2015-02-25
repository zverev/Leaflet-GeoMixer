var delay = 20000,
    layers = {},
    script = '/Layer/CheckVersion.ashx',
    intervalID = null;

var getRequestParams = function(layer) {
    var hosts = {},
        _gmx;
    if (layer) {
        _gmx = layer._gmx;
        var prop = _gmx.properties;
        hosts[_gmx.hostName] = [{
            Name: prop.name,
            Version: prop.LayerVersion
        }];
    } else {
        for (var id in layers) {
            var obj = layers[id];
            if (obj.options.chkUpdate) {
                _gmx = obj._gmx;
                var hostName = _gmx.hostName,
                    pt = {Name: id, Version: _gmx.properties.LayerVersion || 0};
                if (hosts[hostName]) { hosts[hostName].push(pt); }
                else { hosts[hostName] = [pt]; }
            }
        }
    }
    return hosts;
};


var chkVersion = function (layer, callback) {
    if (document.body && !gmxAPIutils.isPageHidden()) {
        var hosts = getRequestParams(layer);
        for (var hostName in hosts) {
            var formData = 'WrapStyle=None';
            formData += '&layers=' + encodeURIComponent(JSON.stringify(hosts[hostName]));
            gmxAPIutils.request({
                url: 'http://' + hostName + script,
                async: true,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                type: 'POST',
                params: formData,
                callback: function(response) {
                    var res = JSON.parse(response);
                    if (res && res.Status === 'ok' && res.Result) {
                        for (var i = 0, len = res.Result.length; i < len; i++) {
                            var item = res.Result[i],
                                prop = item.properties,
                                id = prop.name,
                                layer = layers[id];
                            if (layer && 'updateVersion' in layer) { layer.updateVersion(item); }
                        }
                    }
                    if (callback) { callback(res); }
                },
                onError: function(response) {
                    console.log('Error: LayerVersion ', response);
                }
            });
        }
    }
};

var layersVersion = {

    remove: function(layer) {
        var _gmx = layer._gmx,
            layerID = _gmx.layerID;

        delete layers[layerID];
        _gmx.dataManager.off('chkLayerUpdate', _gmx._chkVersion);
    },

    add: function(layer) {
        var _gmx = layer._gmx,
            prop = _gmx.properties;

        if ('LayerVersion' in prop) {
            layers[_gmx.layerID] = layer;
            _gmx._chkVersion = function () {
                chkVersion(layer);
            };
            _gmx.dataManager.on('chkLayerUpdate', _gmx._chkVersion);

            layersVersion.start();
        }
    },

    chkVersion: chkVersion,

    stop: function() {
        if (intervalID) { clearInterval(intervalID); }
        intervalID = null;
    },

    start: function(msec) {
        if (msec) { delay = msec; }
        layersVersion.stop();
        intervalID = setInterval(chkVersion, delay);
    }
};

if (!L.gmx) { L.gmx = {}; }
L.gmx.layersVersion = layersVersion;

L.gmx.VectorLayer.include({
    updateVersion: function (layerDescription) {
        if (layerDescription) {
            var gmx = this._gmx;
            if (layerDescription.properties) {
                // todo: relocate to dataManager
                gmx.properties = layerDescription.properties;
                gmx.dataManager._tilesTree = null;
                gmx.dataManager._needCheckActiveTiles = true;
                gmx.dataManager._getActiveTileKeys(); //force list update
            }
            //if (layerDescription.geometry) {
                // todo: update layer geometry
            //}
        }
    }
});
