var MapView = function (store) {

    this.index = 4;
    this.savedPosition = false;
    this.initialize = function () {
        this.el = $('body').find('.page-content').empty();
    };

    this.render = function () {
        //ViewMap.initialize(this.el);
        return this;
    };

    this.onShow = function () {
        this.initialize();
        ViewMap.initialize(this.el);
        ViewMap.showPosition();
    }

    this.initialize();
}

var ViewMap = {
    date: null,
    marker: null,
    map: null,
    mapOut: null,
    mapMessage: null,
    mapDiv: null,
    mess: null,
    messError: null,

    initialize: function (el) {
        var header = $('<div class="header"/>').appendTo(el);
        $('<!--<button data-route="orders" class="icon ico_back">&nbsp;</button>--><div class="page-header"><a href="#" class="deploy-sidebar"></a></div></div><div class="bxslider-wrapper" data-snap-ignore="true"><div class="bx-wrapper" style="max-width: 578px;"><div class="bx-viewport" style="width: 100%; overflow: hidden; position: relative; height: 306px;"><div class="bxslider" style="width: 215%; position: relative; -webkit-transition: 0s; transition: 0s; -webkit-transform: translate3d(0px, 0px, 0px);"><div style="float: left; list-style: none; position: relative; width: 578px;" class="bx-clone"><a href="order.php"></a><p align="center"><a href="order.php" class="order"><img src="images/order2.png" width="578px"></a></p><blockquote class="slider-caption"><p class="slider-title">TAXI 16158</p></blockquote></div><div style="float: left; list-style: none; position: relative; width: 600px;"><a href="order.php"></a><p align="center"><a href="order.php" class="order"><img src="images/order2.png" width="600px"></a></p><blockquote class="slider-caption"><p class="slider-title">TAXI 16158</p></blockquote></div><div style="float: left; list-style: none; position: relative; width: 578px;" class="bx-clone"><a href="order.php"></a><p align="center"><a href="order.php"><img src="images/order2.png" width="100%"></a></p><blockquote class="slider-caption"><p class="slider-title">TAXI 16158</p></blockquote></div></div></div><div class="bx-controls bx-has-controls-direction"><div class="bx-controls-direction"><a class="bx-prev disabled" href="">Prev</a><a class="bx-next disabled" href="">Next</a></div></div></div></div>').appendTo(header);        
        var sc = $('<div class="scrollBottom"/>').appendTo(header);
        
        ViewMap.mapDiv = $('<div id="mapDiv"/>').appendTo(sc);
        ViewMap.mapMessage = $('<div id="mapMessage">Waiting ...</div>').appendTo(sc);
        ViewMap.mapOut = $('<div id="mapOut"/>').appendTo(header);

        if (ViewMap.mess) {
            ViewMap.message(ViewMap.mess, ViewMap.messError);
        }
    },

    success: function (position) {
        ViewMap.position = position;
        ViewMap.date = new Date().toTimeString();
        ViewMap.message("Pozícia " + ViewMap.date);
        var d = 'Latitude: ' + position.coords.latitude + '<br />' +
       'Longitude: ' + position.coords.longitude + '<br />' +
        "Presnosť pozície: " + position.coords.accuracy + "m";
        ViewMap.mapOut.html(d);
        ViewMap.setMap(position);
        PositionService.lat = position.coords.latitude;
        PositionService.lng = position.coords.longitude;
    },
    error: function (err) {
        ViewMap.message("Error: " + err.message, true);
    },
    message: function (t, err) {
        if (ViewMap.mapMessage) {
            ViewMap.mapMessage.html(t);
            ViewMap.mapMessage.css("color", err ? "red" : "black");
        }
        else {
            ViewMap.mess = t;
            ViewMap.messError = err;
        }
    },
    setMap: function (position) {
        try {
            if (Map.apiIsOk) {
                ViewMap.point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                //if (!ViewMap.marker) {
                    ViewMap.mapDiv.css("display", "block");
                    ViewMap.map = new google.maps.Map(ViewMap.mapDiv[0], { zoom: 15, disableDefaultUI: true, mapTypeId: google.maps.MapTypeId.ROADMAP });
                    ViewMap.map.setCenter(ViewMap.point);
                    ViewMap.marker = new google.maps.Marker({
                        clickable: false,
                        map: ViewMap.map
                    });
                //}
                google.maps.event.trigger(ViewMap.map, "resize");
                ViewMap.map.setCenter(ViewMap.point);
                ViewMap.marker.setPosition(ViewMap.point);
            }
            else {
                ViewMap.message("Mapy sú nedostupné", true);
            }
        }
        catch (err) {
            ViewMap.message(err.message, true);
        }
    },
    showPosition: function () {
        ViewMap.message("Hľadám pozíciu ...");
        if(ViewMap.position != null) {
            ViewMap.success(ViewMap.position);
            return;
        }
        try {
            navigator.geolocation.getCurrentPosition(ViewMap.success, ViewMap.error, { enableHighAccuracy: true }); //, { frequency: 2000 }
        }
        catch (err) {
            ViewMap.message(err.message, true);
        }
    }
};