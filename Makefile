install:
	npm install

start:
	DEBUG="phonebook" npm run develop

test:
	DEBUG="phonebook" npm run test

test-coverage:
	DEBUG="phonebook" npm run test-coverage

lint:
	npm run lint

.PHONY: test
