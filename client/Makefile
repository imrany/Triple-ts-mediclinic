all: install build delete move

install:
	echo "Installing project dependencies..."
	$(shell which npm > /dev/null 2>&1 || echo "Error: npm is not installed or not in PATH")
	npm install

delete: 
	sudo rm -rf /var/www/triple-ts-mediclinic

build:
	echo "Building project..."
	$(shell which npm > /dev/null 2>&1 || echo "Error: npm is not installed or not in PATH")
	npm run build

move:
	sudo mv ./dist /var/www/triple-ts-mediclinic