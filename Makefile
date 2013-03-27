
run:
	node app.js

stats:
	git ls-files | xargs cat | wc -l
	git shortlog --numbered --summary

.PHONY: run stats
