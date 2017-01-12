# express-lfs

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
		"oid": "d1c7da73aa5d7eb2a5aa67df98cd6f633c594a8113d5c4aadcb5086e71255d45",
		"size": 7
	}]
}
```