install:
	npm install

develop:
	DEBUG="hexlet-phonebook" npm run develop

build:
	rm -rf dist
	npm run build

test:
	DEBUG="hexlet-phonebook" npm run test

lint:
	npm run lint

publish:
	npm publish

.PHONY: test
