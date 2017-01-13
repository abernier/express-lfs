lfsfiles = $(shell git lfs ls-files | awk '{print $$3}')

OBJ=$(addprefix tmp/,$(lfsfiles))

all: $(OBJ)

tmp/%: %
	mkdir -p $(@D) && touch $@
	git show HEAD:$* > $@

.PHONY: debug
debug:
	echo $(OBJ)
