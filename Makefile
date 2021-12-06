install:
	npm install

start:
	DEBUG="phonebook" npm run develop

test:
	DEBUG="phonebook" npm run test

lint:
	npm run lint

.PHONY: test
