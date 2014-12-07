﻿L.gmx.VectorLayer.include({
    bindPopup: function (content, options) {

        if (this._popup) this.unbindPopup();
		if (content instanceof L.Popup) {
			this._popup = content;
		} else {
			if (!this._popup || options) {
				this._popup = new L.Popup(options, this);
			}
			this._popup._initContent = content;
			this._popup.setContent(content);
		}

		if (!this._popupHandlersAdded) {
			this
			    .on('click', this._openPopup, this)
			    .on('remove', this.closePopup, this);

			this._popupHandlersAdded = true;
		}
		if (options && options.popupopen) {
            this._popupopen = options.popupopen;
		}

        this._popup.updateLayout = this._popup._updateLayout;

		return this;
	},

	unbindPopup: function () {
		if (this._popup) {
			this._popup = null;
			this
			    .off('click', this._openPopup)
			    .off('remove', this.closePopup);

            this._popupopen = null;
			this._popupHandlersAdded = false;
		}
        this._gmx.balloonEnable = false;
		return this;
	},

	openPopup: function (latlng, options) {

		if (this._popup) {
			// open the popup from one of the path's points if not specified
			latlng = latlng || this._latlng ||
			         this._latlngs[Math.floor(this._latlngs.length / 2)];

			if (!options) options = {};
            options.latlng = latlng;
            this._openPopup(options);
		}

		return this;
	},

	closePopup: function () {
		if (this._popup) {
			this._popup._close();
            this.fire('popupclose', {popup: this._popup});
		}
		return this;
	},

	_openPopup: function (options) {
        var originalEvent = options.originalEvent || {},
            skip = originalEvent.ctrlKey || originalEvent.altKey || originalEvent.shiftKey;

        if (!skip) {
            var gmx = options.gmx || {},
                properties = gmx.properties,
                spanIDs = {},
                templateBalloon = this._popup._initContent || gmx.templateBalloon;
            if (!templateBalloon) {
                templateBalloon = '';
                for (var key in properties) {
                    templateBalloon += '<b>' + key + ':</b> [' +  key + ']<br />';
                }
            }
            var reg = /\[([^\]]+)\]/i;
            var matches = reg.exec(templateBalloon);
            while(matches && matches.length > 1) {
                var key = matches[1],
                    res = key in properties ? properties[key] : '';
                if (key === 'SUMMARY' && !res) {
                    var geometries = this._gmx.dataManager.getItemGeometries(gmx.id);
                    res = L.gmxUtil.getGeometriesSummary(geometries, this._gmx.units);
                }
                var hookID = gmxAPIutils.newId(),
                    st = "<span id='" + hookID + "'>" + res + "</span>";
                spanIDs[hookID] = key;
                templateBalloon = templateBalloon.replace(matches[0], st);
                matches = reg.exec(templateBalloon);
            }

            this._popup.setContent(templateBalloon);
            this._popup.setLatLng(options.latlng);
            this._map.openPopup(this._popup);

            var arr = this._popup._contentNode.getElementsByTagName("span"),
                spanKeys = {};
            for (var i = 0, len = arr.length; i < len; i++) {
                var span = arr[i],
                    id = span.id;
                if (spanIDs[id]) spanKeys[spanIDs[id]] = span;
            }

            if (this._popupopen) {
                this._popupopen({
                    popup: this._popup,
                    latlng: options.latlng,
                    layerPoint: options.layerPoint,
                    contentNode: this._popup._contentNode,
                    containerPoint: options.containerPoint,
                    originalEvent: options.originalEvent,
                    gmx: {
                        id: gmx.id,
                        properties: gmx.properties,
                        templateBalloon: templateBalloon,
                        spanKeys: spanKeys
                    }
                });
                this._popup._adjustPan();
            }
        }
    }
});
