//Single vector tile, received from GeoMixer server
var gmxVectorTile = function(gmx, x, y, z, v, s, d) {
    var urlPrefix = gmx.tileSenderPrefix + '&ModeKey=tile&r=t' + "&MapName=" + gmx.mapName + "&LayerName=" + gmx.layerName,
        loadDef = null,
        bounds = null,
        isCalcHiddenPoints = false,
        _this = this;
    
    this.load = function() {
        if (loadDef) {
            return loadDef;
        }
        
        this.isEmpty = false;
        loadDef = new gmxDeferred();
        
        var url = urlPrefix + "&z=" + z;
        url += "&x=" + x;
        url += "&y=" + y;
        url += "&v=" + v;
        if(d !== -1) {
            url += "&Level=" + d + "&Span=" + s;
        }
        gmxAPIutils.request({
            'url': url
            ,'callback': function(st) {
                _this.data = JSON.parse(st);
                loadDef.resolve(_this.data);
            }
        });
        
        return loadDef;
    }
    
    this.clear = function() {
        this.isEmpty = true;
        this.data = null;
        isCalcHiddenPoints = false;
        loadDef = null;
    }
    
    this.isIntersects = function(gmxTilePoint) {
        return gmxAPIutils.isTileKeysIntersects(this.gmxTilePoint, gmxTilePoint);
    }
    
    this.calcHiddenPoints = function() {
        if (!this.data || isCalcHiddenPoints) {
            return;
        }
        
        isCalcHiddenPoints = true;
        
		var bounds = this.bounds;
		var d = (bounds.max.x - bounds.min.x)/10000;
		var tbDelta = {									// ������� ����� ��� ����������� onEdge ��������
			'minX': bounds.min.x + d
			,'maxX': bounds.max.x - d
			,'minY': bounds.min.y + d
			,'maxY': bounds.max.y - d
		};
		var chkOnEdge = function(p1, p2, ext) {				// ������� �� �������
			if ((p1[0] < ext.minX && p2[0] < ext.minX) || (p1[0] > ext.maxX && p2[0] > ext.maxX)) return true;
			if ((p1[1] < ext.minY && p2[1] < ext.minY) || (p1[1] > ext.maxY && p2[1] > ext.maxY)) return true;
			return false;
		}
		var getHidden = function(coords, tb) {			// ������ ����� �� �������� ������
			var hideLines = [];
			var prev = null;
			for (var i = 0, len = coords.length; i < len; i++) {
				var p = coords[i];
				if(prev && chkOnEdge(p, prev, tb)) {
					hideLines.push(i);
				}
				prev = p;
			}
			return hideLines;
		}
		for (var i = 0, len = this.data.length; i < len; i++) {
			var it = this.data[i];
			var geom = it['geometry'];
			if(geom['type'].indexOf('POLYGON') !== -1) {
				var hideLines = [];								// ������� ����� ������� �� ������� �����
				var coords = geom['coordinates'];
				var cnt = 0;
				for (var j = 0, len1 = coords.length; j < len1; j++) {
					var coords1 = coords[j];
					if(geom['type'].indexOf('MULTI') !== -1) {
						for (var j1 = 0, len2 = coords1.length; j1 < len2; j1++) {
							hideLines.push(getHidden(coords1[j1], tbDelta));
						}
					} else {
						hideLines.push(getHidden(coords1, tbDelta));
					}
				}
				it.hiddenLines = hideLines;
			}
		}
    }
    
    this.bounds = gmxAPIutils.getTileBounds(x, y, z);
    this.data = null;
    this.x = x;
    this.y = y;
    this.z = z;
    this.s = s;
    this.d = d;
    this.gmxTilePoint = {x: x, y: y, z: z, s: s, d: d};
    this.gmxTileKey = z + '_' + x + '_' + y + '_' + v + '_' + s + '_' + d;
    this.isEmpty = true;
}