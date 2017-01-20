## INSTALL

dependencies:

 - [git-lfs](https://git-lfs.github.com/)

```sh
npm install expresslfs
```

## Usage

```
./node_modules/.bin/expresslfs > oids.json
```

```javascript
var expresslfs = require('express-lfs');

var oids = require('./oids.json');

app.use(expresslfs('public', {
	oids: oids,
	cache: true,
	setHeaders: function (res, path, stat) {
		// See: http://expressjs.com/en/4x/api.html#setHeaders
	}
}))
```

# Note

```sh
git show HEAD:public/foo.txt
version https://git-lfs.github.com/spec/v1
oid sha256:d1c7da73aa5d7eb2a5aa67df98cd6f633c594a8113d5c4aadcb5086e71255d45
size 7
```

```sh
curl -XPOST https://github.com/goodenough/express-lfs.git/info/lfs/objects/batch \
-H"Accept: application/vnd.git-lfs+json" \
-H"Content-Type: application/vnd.git-lfs+json" \
-d @-
{
	"operation": "download",
	"transfers": ["basic"],
	"objects": [{
		"oid": "eeec67f9dacd899e57372fe8dbde7464acf5bb604bdc38585c4d7a025bdda514",
		"size": 20
	}]
}
```
