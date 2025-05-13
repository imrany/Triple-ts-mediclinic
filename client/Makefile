all: delete build move

delete: 
	rm -rf /var/www/triple-ts-mediclinic

build:
	echo "Building project..."
	$(shell which npm > /dev/null 2>&1 || echo "Error: npm is not installed or not in PATH")
	npm run build

move:
	mv ./dist /var/www/triple-ts-mediclinic