# ������������ ������� Leaflet-GeoMixer

Leaflet-GeoMixer - ������ ��� ���������� ������ � �������� ���������� � ����� �����, ��������� � �������������� ���������� Leaflet. 
������ ��������� ��������� ����� ������� ��� ������ � ������� � ������� ��� ������������ ���� �������.

## ������� ������

```html
	<div id="map"></div>
 
	<script src="http://cdn.leafletjs.com/leaflet-0.6.4/leaflet-src.js"></script>
	<script src="leaflet-geomixer.js?key=U92596WMIH"></script>
	<script>
		var map = L.map('map').setView([60, 50], 3);
		
		L.gmx.loadLayer('7VKHM', '295894E2A2F742109AB112DBFEAEFF09').then(function(satelliteLayer) {
		    satelliteLayer.addTo(map);
		});
		
        L.gmx.loadMap('AZR6A', {leafletMap: map});
	</script>
```

## ���������� �������

����� �������� ������, ������ ��������� JS ���� �� ����� ��������:

```html
<script src="leaflet-geomixer.js?key=GeoMixerAPIKey"></script>
```

`GeoMixerAPIKey` - ��� ����������� ����, ������� ������ ���� ������� ��� ������� ������, �� ������� ����������� ������ �� GeoMixer'�. 
���� ���� ����� ���� ������ ��� �������� � ������������� ������� ��� ������� ��� �������� ��� �������� ����.

## ��������� ������ � GeoMixer'e

�������� ��������� � ���������� �������� **����**. ������ ���� ����� ��� �������, ���������� � ���� `ID`, `type` �`title`.
ID ���� ��������� � �������� ������ �������. ��������� ������ ���� �������� **���������** � **���������**.

������ ��������� ���� ������� �� �������������� ��������. ������� ����� ��������� ��������: `type`, `geometry` � `properties`. 

���� � ���������� ������������ � **�����**.

## �������� ����

���� ����������� ��� ������ ��������� ������� � ����������� ������. ���� ��������� �������� ��������� ����.

### L.gmx.loadLayer
```js
 L.gmx.loadLayer(mapID, layerID, options): Promise
```

`mapID` - ID ����� ����������, � `layerID` - ID ���� ������ ���� �����. `options` - ��� �������������� ���������� �� ���������� ���������� �������.

��������|��������|���|�������� �� ���������
------|-----------|:--:|-------------
hostName| ���� ������� ���������� (��� `http://` � `/` � �����)|`String`|maps.kosmosnimki.ru
apiKey|���� ���������� ��� �������� ������. ����� ���� ����� ���� ��� ��� ����������� ������� ������� (��. ����). ��� ������ � `localhost` ���� �� ���������.|`String`|
beginDate|��������� ���� ���������� ��������� (������ ��� �������������� ����)|`Date`|
endDate|�������� ���� ���������� ��������� (������ ��� �������������� ����)|`Date`|

������� ���������� Promise, ������� ����� �������� � ��������� ���� � �������� ������� ��������� (��. �������� ���� ����). 
���� ������� ����� ���� ����������� ��� ���������� ���� �� �����, ��������� ����������� � �.�.

### L.gmx.loadLayers
```js
 L.gmx.loadLayers(layers, commonOptions): Promise
```

��������������� ������� ��� �������� ����� ���������� ����. `layers` - ������ �������� �� ���������� ����������:
  * mapID - ID ����� ����������
  * layerID - ID ����
  * options - �������������� ����� ����

������ ������� ������� ������������ ���������� ������ `L.gmx.loadLayer`. `commonOptions` ����������� �� ���� �����.
���������� Promise, ������� ����� �������� (fulfill) ����� �������� ���� ����. ���� ���������� ��� ��������� ���������.

### L.gmx.loadMap
```js
 L.gmx.loadMap(mapID, options): Promise
```
��������� ��� ���� �� ����������� ����� ����������.

`options` - ����� �������������� ����������

��������|��������|���
------|-----------|:--:|-------------
leafletMap| ����� Leaflet ��� ���������� � ��� ���� ����, ���������� � �������� ����� ���������� |`L.Map`

������� ���������� Promise, ������� ����������� (fulfilled) ��� �������� ���� ����. ��� ���� � �-��� ���������� ��������� ������ ���� `L.gmx.Map`.

## ����� L.gmx.VectorLayer

����� `gmxVectorLayer` ������������� ��������� ��� ���������� ��������� ���� ���������� �� ����� Leaflet.
���� ����� ���� ��������� � ����� ��� ������ ����������� �-��� `L.Map.addLayer()` ��� `L.gmx.VectorLayer.addTo()`.

### ������
�����|���������|������������ ��������|��������
------|------|:---------:|-----------
setFilter|`setFilter(function(item): Boolean)`|`this`| ���������� �-��� ��� ���������� �������� ����� �����������. ������������ �������� - �-���, ������� ��������� ������ �� ���� � ���������� ������ �������� (`false` - �������������)
setDateInterval|`setDateInterval(beginDate, endDate)`|`this`|����� ��������� �������� ��� �������������� ����. ������ ������� �� ����� ��������� ����� ��������� � �������� �� �����. `beginDate` � `endDate` ����� ��� `Date`.
addTo|`addTo(map)`|`this`|�������� ���� �� �����. �������� `map` ����� ��� `L.Map`.

## ����� L.gmx.RasterLayer

����� `L.gmx.RasterLayer` ������ �� ����� ��������� ���� ����������.

Method|Syntax|Return type|Description
------|------|:---------:|-----------
addTo|`addTo(map)`|`this`|�������� ���� �� �����. �������� `map` ����� ��� `L.Map`.

## ����� L.gmx.Map
����� `L.gmx.Map` ������������ ��� ������ � ������ ���������� (��� � ������� ����). �� �������� ��� ������� ��� ������������ � ������ ���� �� �����.

###��������

�������|���|��������
------|:---------:|-----------
layers|`L.gmx.VectorLayer[]` ��� `L.gmx.RasterLayer[]`| ������ ���� ���� �� ����� ����������
layersByID|Object| ��� ���� � ID ���� � �������� ����� ����
layersByTitle|Object| ��� ���� � ���������� (title) ���� � �������� ����� ����