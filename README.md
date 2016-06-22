#Storm Google Maps

Google Maps API geocoder loader and wrapper


##Usage
```
npm install storm-geocoder
```

```
var Geocoder = require('storm-geocoder').init();
```

Or, with Google Maps API key 'XXXXXXXXXXXXX'

```
var Geocoder = require('storm-geocoder').init({
    key: 'XXXXXXXXXXXXX'
});
```

```
Geocoder.find('Edinburgh', function(err, res){
    if(!err){
        console.warn(err);
        return;
    }
    console.log(res);
});

```