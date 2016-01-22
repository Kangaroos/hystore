all: dev
dev:
	@DEBUG=koala-bear*,hystore* UV_THREADPOOL_SIZE=100 NODE_ENV=development ./node_modules/.bin/gulp --harmony server
test:
	@DEBUG=koala-bear*,hystore:intelliparking* NODE_ENV=test ./node_modules/.bin/mocha --harmony test
demo:
	@DEBUG=koala-bear* NODE_ENV=test ./node_modules/.bin/mocha --harmony test/DemoTest.js
doc:
	@./node_modules/.bin/gulp api-doc
.PHONY: test
